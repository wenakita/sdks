import { encodeRouteToPath, Pool, Trade as V3Trade, TradeType, validateAndParseAddress } from 'hermes-v2-sdk'
import { Currency, toHex } from 'maia-core-sdk'

import { ADDRESS_THIS, MSG_SENDER } from '../../constants'
import { SwapOptions } from '../../swapRouter'
import { SWAP_ROUTER_INTERFACE } from './SWAP_ROUTER_INTERFACE'

/**
 * @notice Generates the calldata for a Swap with a V3 Route.
 * @param trade The V3Trade to encode.
 * @param options SwapOptions to use for the trade.
 * @param routerMustCustody Flag for whether funds should be sent to the router
 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
 * @returns A string array of calldatas for the trade.
 */
export function encodeV3Swap(
  trade: V3Trade<Pool, Currency, Currency, TradeType>,
  options: SwapOptions,
  routerMustCustody: boolean,
  performAggregatedSlippageCheck: boolean
): string[] {
  const calldatas: string[] = []

  for (const { route, inputAmount, outputAmount } of trade.swaps) {
    const amountIn: string = toHex(trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient)
    const amountOut: string = toHex(trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient)

    // flag for whether the trade is single hop or not
    const singleHop = route.pools.length === 1

    const recipient = routerMustCustody
      ? ADDRESS_THIS
      : typeof options.recipient === 'undefined'
      ? MSG_SENDER
      : validateAndParseAddress(options.recipient)

    if (singleHop) {
      if (trade.tradeType === TradeType.EXACT_INPUT) {
        const exactInputSingleParams = {
          tokenIn: route.tokenPath[0].address,
          tokenOut: route.tokenPath[1].address,
          fee: route.pools[0].fee,
          recipient,
          amountIn,
          amountOutMinimum: performAggregatedSlippageCheck ? 0 : amountOut,
          sqrtPriceLimitX96: 0,
        }

        calldatas.push(SWAP_ROUTER_INTERFACE.encodeFunctionData('exactInputSingle', [exactInputSingleParams]))
      } else {
        const exactOutputSingleParams = {
          tokenIn: route.tokenPath[0].address,
          tokenOut: route.tokenPath[1].address,
          fee: route.pools[0].fee,
          recipient,
          amountOut,
          amountInMaximum: amountIn,
          sqrtPriceLimitX96: 0,
        }

        calldatas.push(SWAP_ROUTER_INTERFACE.encodeFunctionData('exactOutputSingle', [exactOutputSingleParams]))
      }
    } else {
      const path: string = encodeRouteToPath(route, trade.tradeType === TradeType.EXACT_OUTPUT)

      if (trade.tradeType === TradeType.EXACT_INPUT) {
        const exactInputParams = {
          path,
          recipient,
          amountIn,
          amountOutMinimum: performAggregatedSlippageCheck ? 0 : amountOut,
        }

        calldatas.push(SWAP_ROUTER_INTERFACE.encodeFunctionData('exactInput', [exactInputParams]))
      } else {
        const exactOutputParams = {
          path,
          recipient,
          amountOut,
          amountInMaximum: amountIn,
        }

        calldatas.push(SWAP_ROUTER_INTERFACE.encodeFunctionData('exactOutput', [exactOutputParams]))
      }
    }
  }

  return calldatas
}
