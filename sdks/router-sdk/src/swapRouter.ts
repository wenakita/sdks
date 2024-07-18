/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interface } from '@ethersproject/abi'
import {
  ComposableStablePool,
  ComposableStablePoolWrapper,
  FeeOptions,
  Payments,
  PermitOptions,
  Pool,
  Position,
  SelfPermit,
  Trade as V3Trade,
  TradeType,
  V2Trade,
  WETH9,
} from 'hermes-v2-sdk'
import JSBI from 'jsbi'
import { Currency, CurrencyAmount, MethodParameters, Percent, toHex, ZERO } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { ApprovalTypes, ApproveAndCall, CondensedAddLiquidityOptions } from './approveAndCall'
import { MixedRouteTrade } from './entities/mixedRoute/trade'
import { Trade } from './entities/trade'
import { MulticallExtended, Validation } from './multicallExtended'
import { PaymentsExtended } from './paymentsExtended'
import { encodeSwaps } from './utils/encodeSwaps'
import { SWAP_ROUTER_INTERFACE } from './utils/encodeSwaps/SWAP_ROUTER_INTERFACE'

const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(100))

/**
 * Options for producing the arguments to send calls to the router.
 */
export interface SwapOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  slippageTolerance: Percent

  /**
   * The account that should receive the output. If omitted, output is sent to msg.sender.
   */
  recipient?: string

  /**
   * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
   */
  deadlineOrPreviousBlockhash?: Validation

  /**
   * The optional permit parameters for spending the input.
   */
  inputTokenPermit?: PermitOptions

  /**
   * Optional information for taking a fee on output.
   */
  fee?: FeeOptions
}

export interface SwapAndAddOptions extends SwapOptions {
  /**
   * The optional permit parameters for pulling in remaining output token.
   */
  outputTokenPermit?: PermitOptions
}

export type AllTrades =
  | V2Trade<Currency, Currency, TradeType>
  | V3Trade<Pool, Currency, Currency, TradeType>
  | V3Trade<ComposableStablePool, Currency, Currency, TradeType>
  | V3Trade<ComposableStablePoolWrapper, Currency, Currency, TradeType>
  | MixedRouteTrade<Currency, Currency, TradeType>

export type AnyTrade = Trade<Currency, Currency, TradeType> | AllTrades

export type AnyTradeType = AnyTrade | AllTrades[]

/**
 * Represents the Uniswap V2 + V3 SwapRouter02, and has static methods for helping execute trades.
 */
export abstract class SwapRouter {
  public static INTERFACE: Interface = SWAP_ROUTER_INTERFACE

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(trades: AnyTradeType, options: SwapOptions): MethodParameters {
    const {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut,
    } = encodeSwaps(trades, options)

    // unwrap or sweep
    if (routerMustCustody) {
      if (outputIsNative) {
        calldatas.push(PaymentsExtended.encodeUnwrapWETH9(minimumAmountOut.quotient, options.recipient, options.fee))
      } else {
        calldatas.push(
          PaymentsExtended.encodeSweepToken(
            sampleTrade.outputAmount.currency.wrapped,
            minimumAmountOut.quotient,
            options.recipient,
            options.fee
          )
        )
      }
    }

    // must refund when paying in ETH: either with an uncertain input amount OR if there's a chance of a partial fill.
    // unlike ERC20's, the full ETH value must be sent in the transaction, so the rest must be refunded.
    if (inputIsNative && (sampleTrade.tradeType === TradeType.EXACT_OUTPUT || SwapRouter.riskOfPartialFill(trades))) {
      calldatas.push(Payments.encodeRefundETH())
    }

    return {
      calldata: MulticallExtended.encodeMulticall(calldatas, options.deadlineOrPreviousBlockhash),
      value: toHex(inputIsNative ? totalAmountIn.quotient : ZERO),
    }
  }

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapAndAddCallParameters(
    trades: AnyTradeType,
    options: SwapAndAddOptions,
    position: Position,
    addLiquidityOptions: CondensedAddLiquidityOptions,
    tokenInApprovalType: ApprovalTypes,
    tokenOutApprovalType: ApprovalTypes
  ): MethodParameters {
    const {
      calldatas,
      inputIsNative,
      outputIsNative,
      sampleTrade,
      totalAmountIn: totalAmountSwapped,
      quoteAmountOut,
      minimumAmountOut,
    } = encodeSwaps(trades, options, true)

    // encode output token permit if necessary
    if (options.outputTokenPermit) {
      invariant(quoteAmountOut.currency.isToken, 'NON_TOKEN_PERMIT_OUTPUT')
      calldatas.push(SelfPermit.encodePermit(quoteAmountOut.currency, options.outputTokenPermit))
    }

    const chainId = sampleTrade.route.chainId
    const zeroForOne = position.pool.token0.wrapped.address === totalAmountSwapped.currency.wrapped.address
    const { positionAmountIn, positionAmountOut } = SwapRouter.getPositionAmounts(position, zeroForOne)

    // if tokens are native they will be converted to WETH9
    const tokenIn = inputIsNative ? WETH9[chainId] : positionAmountIn.currency.wrapped
    const tokenOut = outputIsNative ? WETH9[chainId] : positionAmountOut.currency.wrapped

    // if swap output does not make up whole outputTokenBalanceDesired, pull in remaining tokens for adding liquidity
    const amountOutRemaining = positionAmountOut.subtract(quoteAmountOut.wrapped)
    if (amountOutRemaining.greaterThan(CurrencyAmount.fromRawAmount(positionAmountOut.currency, 0))) {
      // if output is native, this means the remaining portion is included as native value in the transaction
      // and must be wrapped. Otherwise, pull in remaining ERC20 token.
      outputIsNative
        ? calldatas.push(PaymentsExtended.encodeWrapETH(amountOutRemaining.quotient))
        : calldatas.push(PaymentsExtended.encodePull(tokenOut, amountOutRemaining.quotient))
    }

    // if input is native, convert to WETH9, else pull ERC20 token
    inputIsNative
      ? calldatas.push(PaymentsExtended.encodeWrapETH(positionAmountIn.quotient))
      : calldatas.push(PaymentsExtended.encodePull(tokenIn, positionAmountIn.quotient))

    // approve token balances to NFTManager
    if (tokenInApprovalType !== ApprovalTypes.NOT_REQUIRED)
      calldatas.push(ApproveAndCall.encodeApprove(tokenIn, tokenInApprovalType))
    if (tokenOutApprovalType !== ApprovalTypes.NOT_REQUIRED)
      calldatas.push(ApproveAndCall.encodeApprove(tokenOut, tokenOutApprovalType))

    // represents a position with token amounts resulting from a swap with maximum slippage
    // hence the minimal amount out possible.
    const minimalPosition = Position.fromAmounts({
      pool: position.pool,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      amount0: zeroForOne ? position.amount0?.quotient.toString() ?? '0' : minimumAmountOut.quotient.toString(),
      amount1: zeroForOne ? minimumAmountOut.quotient.toString() : position.amount1?.quotient.toString() ?? '0',
      useFullPrecision: false,
    })

    // encode NFTManager add liquidity
    calldatas.push(
      ApproveAndCall.encodeAddLiquidity(position, minimalPosition, addLiquidityOptions, options.slippageTolerance)
    )

    // sweep remaining tokens
    inputIsNative
      ? calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO))
      : calldatas.push(PaymentsExtended.encodeSweepToken(tokenIn, ZERO))
    outputIsNative
      ? calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO))
      : calldatas.push(PaymentsExtended.encodeSweepToken(tokenOut, ZERO))

    let value: JSBI
    if (inputIsNative) {
      value = totalAmountSwapped.wrapped.add(positionAmountIn.wrapped).quotient
    } else if (outputIsNative) {
      value = amountOutRemaining.quotient
    } else {
      value = ZERO
    }

    return {
      calldata: MulticallExtended.encodeMulticall(calldatas, options.deadlineOrPreviousBlockhash),
      value: value.toString(),
    }
  }

  // if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
  private static riskOfPartialFill(trades: AnyTradeType): boolean {
    if (Array.isArray(trades)) {
      return trades.some((trade) => {
        return SwapRouter.v3TradeWithHighPriceImpact(trade)
      })
    } else {
      return SwapRouter.v3TradeWithHighPriceImpact(trades)
    }
  }

  private static v3TradeWithHighPriceImpact(trade: AnyTrade): boolean {
    return !(trade instanceof V2Trade) && trade.priceImpact.greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
  }

  private static getPositionAmounts(
    position: Position,
    zeroForOne: boolean
  ): {
    positionAmountIn: CurrencyAmount<Currency>
    positionAmountOut: CurrencyAmount<Currency>
  } {
    const { amount0, amount1 } = position.mintAmounts ?? { amount0: 0, amount1: 0 }
    const currencyAmount0 = CurrencyAmount.fromRawAmount(position.pool.token0, amount0)
    const currencyAmount1 = CurrencyAmount.fromRawAmount(position.pool.token1, amount1)

    const [positionAmountIn, positionAmountOut] = zeroForOne
      ? [currencyAmount0, currencyAmount1]
      : [currencyAmount1, currencyAmount0]
    return { positionAmountIn, positionAmountOut }
  }
}
