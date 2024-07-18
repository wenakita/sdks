import { encodeMixedRouteToPath, RouteV3 } from 'hermes-swap-router-sdk'
import { encodeRouteToPath, TradeType } from 'hermes-v2-sdk'
import { Currency } from 'maia-core-sdk'

import { QuotePlanner } from '../../../utils/quoterCommands'
import { CommandType } from '../../../utils/routerCommands'
import { MixedEncodingParams, SingleEncodingParams } from '.'

// encode a uniswap v3 swap
export function addV3Quote<TInput extends Currency, TOutput extends Currency>(
  planner: QuotePlanner,
  { route, amount, tradeType }: SingleEncodingParams<TInput, TOutput>
): void {
  const path = encodeRouteToPath(route as RouteV3<TInput, TOutput>, tradeType === TradeType.EXACT_OUTPUT)

  if (tradeType == TradeType.EXACT_INPUT) {
    planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [amount.quotient.toString(), path])
  } else if (tradeType == TradeType.EXACT_OUTPUT) {
    planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, [amount.quotient.toString(), path])
  }
}

export function addV3MixedQuote(planner: QuotePlanner, { route, amountIn }: MixedEncodingParams) {
  const path: string = encodeMixedRouteToPath(route)
  planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [amountIn, path])
}
