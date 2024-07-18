import { TradeType, V2Trade, validateAndParseAddress } from 'hermes-v2-sdk'
import { Currency, NativeToken, toHex } from 'maia-core-sdk'

import { ADDRESS_THIS, MSG_SENDER } from '../../constants'
import { SwapOptions } from '../../swapRouter'
import { SWAP_ROUTER_INTERFACE } from './SWAP_ROUTER_INTERFACE'

/**
 * @notice Generates the calldata for a Swap with a V2 Route.
 * @param trade The V2Trade to encode.
 * @param options SwapOptions to use for the trade.
 * @param routerMustCustody Flag for whether funds should be sent to the router
 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
 * @returns A string array of calldatas for the trade.
 */
export function encodeV2Swap(
  trade: V2Trade<Currency, Currency, TradeType>,
  options: SwapOptions,
  routerMustCustody: boolean,
  performAggregatedSlippageCheck: boolean
): string {
  const amountIn: string = toHex(trade.maximumAmountIn(options.slippageTolerance).quotient)
  const amountOut: string = toHex(trade.minimumAmountOut(options.slippageTolerance).quotient)

  const path = trade.route.path.map((token: NativeToken) => token.address)
  const recipient = routerMustCustody
    ? ADDRESS_THIS
    : typeof options.recipient === 'undefined'
    ? MSG_SENDER
    : validateAndParseAddress(options.recipient)

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    const exactInputParams = [amountIn, performAggregatedSlippageCheck ? 0 : amountOut, path, recipient]

    return SWAP_ROUTER_INTERFACE.encodeFunctionData('swapExactTokensForTokens', exactInputParams)
  } else {
    const exactOutputParams = [amountOut, amountIn, path, recipient]

    return SWAP_ROUTER_INTERFACE.encodeFunctionData('swapTokensForExactTokens', exactOutputParams)
  }
}
