import {
  ComposableStablePool,
  ComposableStablePoolWrapper,
  IPool,
  Pool,
  SelfPermit,
  Trade as V3Trade,
  TradeType,
  V2Trade,
} from 'hermes-v2-sdk'
import { Currency, CurrencyAmount } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { MixedRouteTrade } from '../../entities/mixedRoute/trade'
import { Protocol } from '../../entities/protocol'
import { MixedRoute, RouteStable, RouteStableWrapper, RouteV2, RouteV3 } from '../../entities/route'
import { Trade } from '../../entities/trade'
import { AllTrades, AnyTrade, AnyTradeType, SwapOptions } from '../../swapRouter'
import { encodeMixedRouteSwap } from './encodeMixedRouteSwap'
import { encodeStableSwap } from './encodeStableSwap'
import { encodeV2Swap } from './encodeV2Swap'
import { encodeV3Swap } from './encodeV3Swap'
import { encodeVaultSwap } from './encodeVaultSwap'

/**
 * @notice Generates the calldata for a Swap with a V3 Route.
 * @param trade The V3Trade to encode.
 * @param options SwapOptions to use for the trade.
 * @param routerMustCustody Flag for whether funds should be sent to the router
 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
 * @returns A string array of calldatas for the trade.
 */
function encodeSwap(
  trade: V3Trade<IPool, Currency, Currency, TradeType>,
  options: SwapOptions,
  routerMustCustody: boolean,
  performAggregatedSlippageCheck: boolean
): string[] {
  const calldatas: string[] = []

  const protocol = Trade.tradeProtocol(trade)
  if (protocol == Protocol.V3) {
    for (const calldata of encodeV3Swap(
      trade as V3Trade<Pool, Currency, Currency, TradeType>,
      options,
      routerMustCustody,
      performAggregatedSlippageCheck
    )) {
      calldatas.push(calldata)
    }
  } else if (protocol == Protocol.BAL_STABLE) {
    for (const calldata of encodeStableSwap(
      trade as V3Trade<ComposableStablePool, Currency, Currency, TradeType>,
      options,
      routerMustCustody,
      performAggregatedSlippageCheck
    )) {
      calldatas.push(calldata)
    }
  } else if (protocol == Protocol.BAL_STABLE_WRAPPER) {
    for (const calldata of encodeVaultSwap(
      trade as V3Trade<ComposableStablePoolWrapper, Currency, Currency, TradeType>,
      options,
      routerMustCustody,
      performAggregatedSlippageCheck
    )) {
      calldatas.push(calldata)
    }
  } else {
    throw new Error('UNSUPPORTED_TRADE_PROTOCOL')
  }

  return calldatas
}

export function encodeSwaps(
  trades: AnyTradeType,
  options: SwapOptions,
  isSwapAndAdd?: boolean
): {
  calldatas: string[]
  sampleTrade: AllTrades
  routerMustCustody: boolean
  inputIsNative: boolean
  outputIsNative: boolean
  totalAmountIn: CurrencyAmount<Currency>
  minimumAmountOut: CurrencyAmount<Currency>
  quoteAmountOut: CurrencyAmount<Currency>
} {
  // If dealing with an instance of the aggregated Trade object, unbundle it to individual trade objects.
  if (trades instanceof Trade) {
    invariant(
      trades.swaps.every(
        (swap) =>
          swap.route.protocol == Protocol.V3 ||
          swap.route.protocol == Protocol.V2 ||
          swap.route.protocol == Protocol.BAL_STABLE ||
          swap.route.protocol == Protocol.BAL_STABLE_WRAPPER ||
          swap.route.protocol == Protocol.MIXED
      ),
      'UNSUPPORTED_PROTOCOL'
    )

    const individualTrades: AllTrades[] = []

    for (const { route, inputAmount, outputAmount } of trades.swaps) {
      if (route.protocol == Protocol.V2) {
        individualTrades.push(
          new V2Trade(
            route as RouteV2<Currency, Currency>,
            trades.tradeType == TradeType.EXACT_INPUT ? inputAmount : outputAmount,
            trades.tradeType
          )
        )
      } else if (route.protocol == Protocol.V3) {
        individualTrades.push(
          V3Trade.createUncheckedTrade({
            route: route as RouteV3<Currency, Currency>,
            inputAmount,
            outputAmount,
            tradeType: trades.tradeType,
          })
        )
      } else if (route.protocol == Protocol.MIXED) {
        individualTrades.push(
          /// we can change the naming of this function on MixedRouteTrade if needed
          MixedRouteTrade.createUncheckedTrade({
            route: route as MixedRoute<Currency, Currency>,
            inputAmount,
            outputAmount,
            tradeType: trades.tradeType,
          })
        )
      } else if (route.protocol == Protocol.BAL_STABLE) {
        individualTrades.push(
          V3Trade.createUncheckedTrade({
            route: route as RouteStable<Currency, Currency>,
            inputAmount,
            outputAmount,
            tradeType: trades.tradeType,
          })
        )
      } else if (route.protocol == Protocol.BAL_STABLE_WRAPPER) {
        individualTrades.push(
          V3Trade.createUncheckedTrade({
            route: route as RouteStableWrapper<Currency, Currency>,
            inputAmount,
            outputAmount,
            tradeType: trades.tradeType,
          })
        )
      } else {
        throw new Error('UNSUPPORTED_TRADE_PROTOCOL')
      }
    }
    trades = individualTrades
  }

  if (!Array.isArray(trades)) {
    trades = [trades]
  }

  const numberOfTrades = trades.reduce(
    (numberOfTrades: number, trade: AnyTradeType) =>
      numberOfTrades + (trade instanceof V3Trade || trade instanceof MixedRouteTrade ? trade.swaps.length : 1),
    0
  )

  const sampleTrade = trades[0]

  // All trades should have the same starting/ending currency and trade type
  invariant(
    trades.every((trade: AnyTrade) => trade.inputAmount.currency.equals(sampleTrade.inputAmount.currency)),
    'TOKEN_IN_DIFF'
  )
  invariant(
    trades.every((trade: AnyTrade) => trade.outputAmount.currency.equals(sampleTrade.outputAmount.currency)),
    'TOKEN_OUT_DIFF'
  )
  invariant(
    trades.every((trade: AnyTrade) => trade.tradeType === sampleTrade.tradeType),
    'TRADE_TYPE_DIFF'
  )

  const calldatas: string[] = []

  const inputIsNative = sampleTrade.inputAmount.currency.isNative
  const outputIsNative = sampleTrade.outputAmount.currency.isNative

  // flag for whether we want to perform an aggregated slippage check
  //   1. when there are >2 exact input trades. this is only a heuristic,
  //      as it's still more gas-expensive even in this case, but has benefits
  //      in that the reversion probability is lower
  const performAggregatedSlippageCheck = sampleTrade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2
  // flag for whether funds should be send first to the router
  //   1. when receiving ETH (which much be unwrapped from WETH)
  //   2. when a fee on the output is being taken
  //   3. when performing swap and add
  //   4. when performing an aggregated slippage check
  const routerMustCustody = outputIsNative || !!options.fee || !!isSwapAndAdd || performAggregatedSlippageCheck

  // encode permit if necessary
  if (options.inputTokenPermit) {
    invariant(sampleTrade.inputAmount.currency.isToken, 'NON_TOKEN_PERMIT')
    calldatas.push(SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit))
  }

  for (const trade of trades) {
    if (trade instanceof V2Trade) {
      calldatas.push(encodeV2Swap(trade, options, routerMustCustody, performAggregatedSlippageCheck))
    } else if (trade instanceof V3Trade) {
      for (const calldata of encodeSwap(trade, options, routerMustCustody, performAggregatedSlippageCheck)) {
        calldatas.push(calldata)
      }
    } else if (trade instanceof MixedRouteTrade) {
      for (const calldata of encodeMixedRouteSwap(trade, options, routerMustCustody, performAggregatedSlippageCheck)) {
        calldatas.push(calldata)
      }
    } else {
      throw new Error('Unsupported trade object')
    }
  }

  const ZERO_IN: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(sampleTrade.inputAmount.currency, 0)
  const ZERO_OUT: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0)

  const minimumAmountOut: CurrencyAmount<Currency> = trades.reduce(
    (sum: CurrencyAmount<Currency>, trade: AnyTrade) => sum.add(trade.minimumAmountOut(options.slippageTolerance)),
    ZERO_OUT
  )

  const quoteAmountOut: CurrencyAmount<Currency> = trades.reduce(
    (sum: CurrencyAmount<Currency>, trade: AnyTrade) => sum.add(trade.outputAmount),
    ZERO_OUT
  )

  const totalAmountIn: CurrencyAmount<Currency> = trades.reduce(
    (sum: CurrencyAmount<Currency>, trade: AnyTrade) => sum.add(trade.maximumAmountIn(options.slippageTolerance)),
    ZERO_IN
  )

  return {
    calldatas,
    sampleTrade,
    routerMustCustody,
    inputIsNative,
    outputIsNative,
    totalAmountIn,
    minimumAmountOut,
    quoteAmountOut,
  }
}
