import { TradeType, validateAndParseAddress } from 'hermes-v2-sdk'
import { Currency, toHex } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { ADDRESS_THIS, MSG_SENDER } from '../../../constants'
import { MixedRouteSDK } from '../../../entities/mixedRoute/route'
import { MixedRouteTrade } from '../../../entities/mixedRoute/trade'
import { MixedRoute } from '../../../entities/route'
import { SwapOptions } from '../../../swapRouter'
import { EncodingType, getOutputOfPools, getTypeGroup, partitionMixedRouteByProtocol } from '../..'
import { encodeMixedV2Route, encodeV2Route } from './encodeV2Route'
import { encodeMixedV3Route, encodeV3Route } from './encodeV3Route'

export type EncodingParams = {
  route: MixedRouteSDK<Currency, Currency>
  amountIn: string
  amountOutMinimum: string
  recipient: string
  // Add any other relevant properties that your encoding functions might need here
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function unsupportedPoolType(_encodingParams: EncodingParams): string {
  throw new Error('UNSUPPORTED_SWAP_ROUTER_POOL_TYPE')
}

// Mapping of pool types to their encoding functions
const poolEncodingStrategies = {
  [EncodingType.V3]: encodeV3Route,
  [EncodingType.V2]: encodeV2Route,
  [EncodingType.BAL_STABLE]: unsupportedPoolType,
  [EncodingType.VAULT]: unsupportedPoolType,
  // Add new pool types and their corresponding functions here
}

// Mapping of pool types to their encoding functions for mixed routes
const mixedPoolEncodingStrategies = {
  [EncodingType.V3]: encodeMixedV3Route,
  [EncodingType.V2]: encodeMixedV2Route,
  [EncodingType.BAL_STABLE]: unsupportedPoolType,
  [EncodingType.VAULT]: unsupportedPoolType,
  // Add new pool types and their corresponding functions here
}

// Function to determine the encoding strategy for a given route
function getEncodingStrategyForRoute(route: MixedRouteSDK<Currency, Currency>) {
  const typeGroup: EncodingType = getTypeGroup(route.pools[0]) // Assuming all pools in a route are of the same type
  const encodingStrategy = poolEncodingStrategies[typeGroup]

  if (!encodingStrategy) {
    throw new Error(`No encoding strategy found for pool type: ${typeGroup}`)
  }

  return encodingStrategy
}

// Function to determine the encoding strategy for a given route
function getEncodingStrategyForMixedRoute(route: MixedRouteSDK<Currency, Currency>) {
  const typeGroup: EncodingType = getTypeGroup(route.pools[0]) // Assuming all pools in a route are of the same type
  const mixedEncodingStrategy = mixedPoolEncodingStrategies[typeGroup]

  if (!mixedEncodingStrategy) {
    throw new Error(`No encoding strategy found for pool type: ${typeGroup}`)
  }

  return mixedEncodingStrategy
}

/**
 * @notice Generates the calldata for a MixedRouteSwap. Since single hop routes are not MixedRoutes, we will
 *         instead generate them via the existing encodeV3Swap and encodeV2Swap methods.
 * @param trade The MixedRouteTrade to encode.
 * @param options SwapOptions to use for the trade.
 * @param routerMustCustody Flag for whether funds should be sent to the router
 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
 * @returns A string array of calldatas for the trade.
 */
export function encodeMixedRouteSwap(
  trade: MixedRouteTrade<Currency, Currency, TradeType>,
  options: SwapOptions,
  routerMustCustody: boolean,
  performAggregatedSlippageCheck: boolean
): string[] {
  const calldatas: string[] = []

  invariant(trade.tradeType === TradeType.EXACT_INPUT, 'TRADE_TYPE')

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
      const encodingParams: EncodingParams = {
        route,
        amountIn,
        amountOutMinimum: performAggregatedSlippageCheck ? '0' : amountOut,
        recipient,
      }

      /// For single hop, since it isn't really a mixedRoute, we'll just mimic behavior of each pool type
      /// We don't use encodeV3Swap(), encodeV2Swap(), etc. because casting the trade to a Trade is overcomplex
      const encodeFunc = getEncodingStrategyForRoute(route)
      calldatas.push(encodeFunc(encodingParams))
    } else {
      const sections = partitionMixedRouteByProtocol(route)

      const isLastSectionInRoute = (i: number) => {
        return i === sections.length - 1
      }

      let outputToken
      let inputToken = route.input.wrapped

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        /// Now, we get output of this section
        outputToken = getOutputOfPools(section, inputToken)

        const newRouteOriginal = new MixedRouteSDK(
          [...section],
          section[0].token0.equals(inputToken) ? section[0].token0 : section[0].token1,
          outputToken
        )
        const newRoute = new MixedRoute(newRouteOriginal)

        /// Previous output is now input
        inputToken = outputToken

        const encodingParams: EncodingParams = {
          route: newRoute,
          amountIn: i === 0 ? amountIn : '0',
          amountOutMinimum: isLastSectionInRoute(i) ? amountOut : '0',
          recipient: isLastSectionInRoute(i) ? recipient : ADDRESS_THIS,
        }

        const encodeFunc = getEncodingStrategyForMixedRoute(newRoute)
        calldatas.push(encodeFunc(encodingParams))
      }
    }
  }

  return calldatas
}
