import { encodeMixedRouteToPath, RouteV3 } from 'hermes-swap-router-sdk'
import { encodeRouteToPath, Trade as V3Trade, TradeType } from 'hermes-v2-sdk'
import { Currency } from 'maia-core-sdk'

import { ROUTER_AS_RECIPIENT } from '../../../utils/constants'
import { CommandType, RoutePlanner } from '../../../utils/routerCommands'
import { Swap } from '../uniswap'
import { EncodingParams, MixedEncodingParams } from './addMixedSwap'

// encode a uniswap v3 swap
export function addV3Swap<TInput extends Currency, TOutput extends Currency>(
  planner: RoutePlanner,
  { swap, tradeType, options, payerIsUser, routerMustCustody }: EncodingParams<TInput, TOutput>
): void {
  const { route, inputAmount, outputAmount }: Swap<TInput, TOutput> = swap

  const trade = V3Trade.createUncheckedTrade({
    route: route as RouteV3<TInput, TOutput>,
    inputAmount,
    outputAmount,
    tradeType,
  })

  const path = encodeRouteToPath(route as RouteV3<TInput, TOutput>, trade.tradeType === TradeType.EXACT_OUTPUT)
  if (tradeType == TradeType.EXACT_INPUT) {
    planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
      routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
      trade.maximumAmountIn(options.slippageTolerance).quotient.toString(),
      trade.minimumAmountOut(options.slippageTolerance).quotient.toString(),
      path,
      payerIsUser,
    ])
  } else if (tradeType == TradeType.EXACT_OUTPUT) {
    planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, [
      routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
      trade.minimumAmountOut(options.slippageTolerance).quotient.toString(),
      trade.maximumAmountIn(options.slippageTolerance).quotient.toString(),
      path,
      payerIsUser,
    ])
  }
}

export function addV3MixedSwap(
  planner: RoutePlanner,
  { route, recipient, amountIn, amountOut, payerIsUser }: MixedEncodingParams
) {
  const path: string = encodeMixedRouteToPath(route)
  planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [recipient, amountIn, amountOut, path, payerIsUser])
}
