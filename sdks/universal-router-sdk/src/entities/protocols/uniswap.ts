import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { IRoute, SwapOptions as RouterSwapOptions, TPool, Trade as RouterTrade } from 'hermes-swap-router-sdk'
import { TradeType } from 'hermes-v2-sdk'
import { Currency, CurrencyAmount, Percent } from 'maia-core-sdk'

import { ApproveProtocol, Permit2Permit } from '../../types'
import { ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from '../../utils/constants'
import { encodeFeeBips } from '../../utils/numbers'
import { CommandType, RoutePlanner } from '../../utils/routerCommands'
import { Command, RouterTradeType, TradeConfig } from '../Command'
import { addMixedSwap, EncodingParams } from './addSwap/addMixedSwap'

export type FlatFeeOptions = {
  amount: BigNumberish
  recipient: string
}

export type RouteOptions = {
  useContractBalance: boolean
  routerMustCustody: boolean
}

// the existing router permit object doesn't include enough data for permit2
// so we extend swap options with the permit2 permit
export type SwapOptions = Omit<RouterSwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Permit
  payerIsRouter?: boolean
  flatFee?: FlatFeeOptions
  // Tokens for the router to approve
  approveTokens?: ApproveProtocol[] // token addresses
}

const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(50, 100)

export interface Swap<TInput extends Currency, TOutput extends Currency> {
  route: IRoute<TInput, TOutput, TPool>
  inputAmount: CurrencyAmount<TInput>
  outputAmount: CurrencyAmount<TOutput>
}

// Wrapper for uniswap router-sdk trade entity to encode swaps for Universal Router
// also translates trade objects from previous (v2, v3) SDKs
export class UniswapTrade implements Command {
  readonly tradeType: RouterTradeType = RouterTradeType.UniswapTrade
  constructor(
    public trade: RouterTrade<Currency, Currency, TradeType>,
    public options: SwapOptions,
    public routesOptions?: RouteOptions[],
    public overrideInputCurrency?: Currency,
    public overrideOutputAmount?: CurrencyAmount<Currency>
  ) {
    if (!!options.fee && !!options.flatFee) throw new Error('Only one fee option permitted')
    if (!!routesOptions && routesOptions.length !== trade.routes.length) {
      throw new Error('If defined, routesOptions must be the same length as routes')
    }
  }

  encode(planner: RoutePlanner, _config: TradeConfig): void {
    let payerIsUser = !this.options.payerIsRouter

    const inputIsNative = (this.overrideInputCurrency ?? this.trade.inputAmount.currency).isNative

    // If the input currency is the native currency, we need to wrap it with the router as the recipient
    if (inputIsNative) {
      // TODO: optimize if only one v2 pool we can directly send this to the pool
      planner.addCommand(CommandType.WRAP_ETH, [
        ROUTER_AS_RECIPIENT,
        this.trade.maximumAmountIn(this.options.slippageTolerance).quotient.toString(),
      ])
      // since WETH is now owned by the router, the router pays for inputs
      payerIsUser = false
    }
    // The overall recipient at the end of the trade, SENDER_AS_RECIPIENT uses the msg.sender
    this.options.recipient = this.options.recipient ?? SENDER_AS_RECIPIENT

    // flag for whether we want to perform slippage check on aggregate output of multiple routes
    //   1. when there are >2 exact input trades. this is only a heuristic,
    //      as it's still more gas-expensive even in this case, but has benefits
    //      in that the reversion probability is lower
    const performAggregatedSlippageCheck =
      this.trade.tradeType === TradeType.EXACT_INPUT && this.trade.routes.length > 2
    const outputIsNative = (this.overrideOutputAmount ?? this.trade.outputAmount).currency.isNative
    const routerMustCustody = performAggregatedSlippageCheck || outputIsNative || hasFeeOption(this.options)

    for (let i = 0; i < this.trade.swaps.length; i++) {
      const swap = this.trade.swaps[i]

      const routeOption = this.routesOptions?.[i]

      const params: EncodingParams<Currency, Currency> = {
        swap,
        tradeType: this.trade.tradeType,
        options: this.options,
        payerIsUser,
        routerMustCustody: routerMustCustody || !!routeOption?.routerMustCustody,
        useContractBalance: routeOption?.useContractBalance,
      }

      addMixedSwap(planner, params)
    }

    // The router custodies for 3 reasons: to unwrap, to take a fee, and/or to do a slippage check
    if (routerMustCustody) {
      let minimumAmountOut: BigNumber = BigNumber.from(
        this.trade.minimumAmountOut(this.options.slippageTolerance, this.overrideOutputAmount).quotient.toString()
      )

      // If there is a fee, that percentage is sent to the fee recipient
      // In the case where ETH is the output currency, the fee is taken in WETH (for gas reasons)
      if (!!this.options.fee) {
        const feeBips = encodeFeeBips(this.options.fee.fee)
        planner.addCommand(CommandType.PAY_PORTION, [
          this.trade.outputAmount.currency.wrapped.address,
          this.options.fee.recipient,
          feeBips,
        ])

        // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
        // Otherwise we continue as expected with the trade's normal expected output
        if (this.trade.tradeType === TradeType.EXACT_OUTPUT) {
          minimumAmountOut = minimumAmountOut.sub(minimumAmountOut.mul(feeBips).div(10000))
        }
      }

      // If there is a flat fee, that absolute amount is sent to the fee recipient
      // In the case where ETH is the output currency, the fee is taken in WETH (for gas reasons)
      if (!!this.options.flatFee) {
        const feeAmount = this.options.flatFee.amount
        if (minimumAmountOut.lt(feeAmount)) throw new Error('Flat fee amount greater than minimumAmountOut')

        planner.addCommand(CommandType.TRANSFER, [
          this.trade.outputAmount.currency.wrapped.address,
          this.options.flatFee.recipient,
          feeAmount,
        ])

        // If the trade is exact output, and a fee was taken, we must adjust the amount out to be the amount after the fee
        // Otherwise we continue as expected with the trade's normal expected output
        if (this.trade.tradeType === TradeType.EXACT_OUTPUT) {
          minimumAmountOut = minimumAmountOut.sub(feeAmount)
        }
      }

      // The remaining tokens that need to be sent to the user after the fee is taken will be caught
      // by this if-else clause.
      if (outputIsNative) {
        planner.addCommand(CommandType.UNWRAP_WETH, [this.options.recipient, minimumAmountOut])
      } else {
        planner.addCommand(CommandType.SWEEP, [
          this.trade.outputAmount.currency.wrapped.address,
          this.options.recipient,
          minimumAmountOut,
        ])
      }
    }

    if (
      inputIsNative &&
      (this.trade.tradeType === TradeType.EXACT_OUTPUT ||
        // If overrideInputCurrency or overrideOutputAmount are true, we can't calculate the overall price impact
        !!this.overrideInputCurrency ||
        !!this.overrideOutputAmount ||
        riskOfPartialFill(this.trade))
    ) {
      // for exactOutput swaps that take native currency as input
      // we need to send back the change to the user
      planner.addCommand(CommandType.UNWRAP_WETH, [this.options.recipient, 0])
    }
  }
}

// if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
function riskOfPartialFill(trade: RouterTrade<Currency, Currency, TradeType>): boolean {
  return trade.priceImpact.greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
}

function hasFeeOption(swapOptions: SwapOptions): boolean {
  return !!swapOptions.fee || !!swapOptions.flatFee
}
