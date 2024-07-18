import { RouteV2, TPool } from 'hermes-swap-router-sdk'
import { Pair, TradeType, V2Trade } from 'hermes-v2-sdk'
import { Currency, NativeToken } from 'maia-core-sdk'

import { ROUTER_AS_RECIPIENT } from '../../../utils/constants'
import { CommandType, RoutePlanner } from '../../../utils/routerCommands'
import { Swap } from '../uniswap'
import { EncodingParams, MixedEncodingParams } from './addMixedSwap'

export function nextSectionRecipientV2(pool: TPool): string {
  return (pool as Pair).liquidityToken.address
}

// encode a uniswap v2 swap
export function addV2Swap<TInput extends Currency, TOutput extends Currency>(
  planner: RoutePlanner,
  { swap, tradeType, options, payerIsUser, routerMustCustody }: EncodingParams<TInput, TOutput>
): void {
  const { route, inputAmount, outputAmount }: Swap<TInput, TOutput> = swap

  const trade = new V2Trade(
    route as RouteV2<TInput, TOutput>,
    tradeType == TradeType.EXACT_INPUT ? inputAmount : outputAmount,
    tradeType
  )

  if (tradeType == TradeType.EXACT_INPUT) {
    planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
      // if native, we have to unwrap so keep in the router for now
      routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
      trade.maximumAmountIn(options.slippageTolerance).quotient.toString(),
      trade.minimumAmountOut(options.slippageTolerance).quotient.toString(),
      route.path.map((pool: NativeToken) => pool.address),
      payerIsUser,
    ])
  } else if (tradeType == TradeType.EXACT_OUTPUT) {
    planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, [
      routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
      trade.minimumAmountOut(options.slippageTolerance).quotient.toString(),
      trade.maximumAmountIn(options.slippageTolerance).quotient.toString(),
      route.path.map((pool: NativeToken) => pool.address),
      payerIsUser,
    ])
  }
}

export function addV2MixedSwap(
  planner: RoutePlanner,
  { route, recipient, amountIn, amountOut, payerIsUser }: MixedEncodingParams
) {
  planner.addCommand(CommandType.V2_SWAP_EXACT_IN, [
    recipient,
    amountIn,
    amountOut,
    route.path.map((pool) => pool.address),
    payerIsUser,
  ])
}
