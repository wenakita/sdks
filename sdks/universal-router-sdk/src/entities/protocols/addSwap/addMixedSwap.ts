import { BigNumber } from '@ethersproject/bignumber'
import {
  EncodingType,
  getOutputOfPools,
  getTypeGroup,
  MixedRoute,
  MixedRouteSDK,
  MixedRouteTrade,
  partitionMixedRouteByProtocol,
  Protocol,
  RouteStable,
  RouteStableWrapper,
  RouteV2,
  RouteV3,
  TPool,
} from 'hermes-swap-router-sdk'
import { TradeType, V2Trade, Trade as V3Trade } from 'hermes-v2-sdk'
import { Currency, NativeToken } from 'maia-core-sdk'

import { CONTRACT_BALANCE, ROUTER_AS_RECIPIENT } from '../../../utils/constants'
import { RoutePlanner } from '../../../utils/routerCommands'
import { Swap, SwapOptions } from '../uniswap'
import { addStableMixedSwap, addStableSwap } from './addStableSwap'
import { addV2MixedSwap, addV2Swap, nextSectionRecipientV2 } from './addV2Swap'
import { addV3MixedSwap, addV3Swap } from './addV3Swap'
import { addVaultMixedSwap, addVaultSwap } from './addVaultSwap'

export type EncodingParams<TInput extends Currency, TOutput extends Currency> = {
  swap: Swap<TInput, TOutput>
  tradeType: TradeType
  options: SwapOptions
  payerIsUser: boolean
  routerMustCustody: boolean
  useContractBalance?: boolean
}

export type MixedEncodingParams = {
  route: MixedRoute<NativeToken, NativeToken>
  recipient: string | undefined
  amountIn: string | BigNumber
  amountOut: string
  payerIsUser: boolean
  useContractBalance?: boolean
}

// Mapping of pool types to their encoding functions
const poolEncodingStrategies = {
  [EncodingType.V3]: addV3Swap,
  [EncodingType.BAL_STABLE]: addStableSwap,
  [EncodingType.VAULT]: addVaultSwap,
  [EncodingType.V2]: addV2Swap,
  // Add new pool types and their corresponding functions here
}

// Mapping of pool types to their encoding functions for mixed routes
const mixedPoolEncodingStrategies = {
  [EncodingType.V3]: addV3MixedSwap,
  [EncodingType.BAL_STABLE]: addStableMixedSwap,
  [EncodingType.VAULT]: addVaultMixedSwap,
  [EncodingType.V2]: addV2MixedSwap,
  // Add new pool types and their corresponding functions here
}

// Function to determine the encoding strategy for a given route
export function getAddSwapForRoute(route: MixedRouteSDK<Currency, Currency>) {
  const typeGroup: EncodingType = getTypeGroup(route.pools[0]) // Assuming all pools in a route are of the same type
  const addSwapForRoute = poolEncodingStrategies[typeGroup]

  if (!addSwapForRoute) {
    throw new Error(`No encoding strategy found for pool type: ${typeGroup}`)
  }

  return addSwapForRoute
}

// Function to determine the encoding strategy for a given route
function getAddMixedSwapForSection(
  route: MixedRouteSDK<Currency, Currency>
): (planner: RoutePlanner, encodingParams: MixedEncodingParams) => void {
  const typeGroup: EncodingType = getTypeGroup(route.pools[0]) // Assuming all pools in a route are of the same type
  const addMixedSwapForSection = mixedPoolEncodingStrategies[typeGroup]

  if (!addMixedSwapForSection) {
    throw new Error(`No encoding strategy found for pool type: ${typeGroup}`)
  }

  return addMixedSwapForSection
}

// Mapping of pool types to their encoding functions
const poolNextSectionRecipient = {
  [EncodingType.V3]: undefined,
  [EncodingType.BAL_STABLE]: undefined,
  [EncodingType.VAULT]: undefined,
  [EncodingType.V2]: nextSectionRecipientV2,
  // Add new pool types and their corresponding functions here
}

// Function to determine the encoding strategy for a given route
function getNextSectionRecipient(nextSection: TPool[]): string {
  const pool = nextSection[0]
  const typeGroup: EncodingType = getTypeGroup(pool) // Assuming all pools in a route are of the same type
  const nextRecipient = poolNextSectionRecipient[typeGroup]

  if (!nextRecipient) {
    return ROUTER_AS_RECIPIENT
  }

  return nextRecipient(pool)
}

// encode a mixed route swap, i.e. including both v2 and v3 pools
export function addMixedSwap<TInput extends Currency, TOutput extends Currency>(
  planner: RoutePlanner,
  { swap, tradeType, options, payerIsUser, routerMustCustody, useContractBalance }: EncodingParams<TInput, TOutput>
): void {
  const { route, inputAmount, outputAmount }: Swap<TInput, TOutput> = swap
  const tradeRecipient = routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient

  // single hop, so it can be reduced to plain single swap logic
  if (route.pools.length === 1) {
    const params: EncodingParams<TInput, TOutput> = {
      swap,
      tradeType,
      options,
      payerIsUser,
      routerMustCustody,
      useContractBalance,
    }

    const addSwapForRoute = getAddSwapForRoute(route as MixedRoute<TInput, TOutput>)

    addSwapForRoute(planner, params)
  } else {
    let trade

    if (route.protocol == Protocol.V2) {
      trade = new V2Trade(
        route as RouteV2<TInput, TOutput>,
        tradeType == TradeType.EXACT_INPUT ? inputAmount : outputAmount,
        tradeType
      )
    } else if (route.protocol == Protocol.V3) {
      trade = V3Trade.createUncheckedTrade({
        route: route as RouteV3<TInput, TOutput>,
        inputAmount,
        outputAmount,
        tradeType: tradeType,
      })
    } else if (route.protocol == Protocol.MIXED) {
      /// we can change the naming of this function on MixedRouteTrade if needed
      trade = MixedRouteTrade.createUncheckedTrade({
        route: route as MixedRoute<TInput, TOutput>,
        inputAmount,
        outputAmount,
        tradeType: tradeType,
      })
    } else if (route.protocol == Protocol.BAL_STABLE) {
      trade = V3Trade.createUncheckedTrade({
        route: route as RouteStable<TInput, TOutput>,
        inputAmount,
        outputAmount,
        tradeType: tradeType,
      })
    } else if (route.protocol == Protocol.BAL_STABLE_WRAPPER) {
      trade = V3Trade.createUncheckedTrade({
        route: route as RouteStableWrapper<TInput, TOutput>,
        inputAmount,
        outputAmount,
        tradeType: tradeType,
      })
    } else {
      throw new Error('UNSUPPORTED_TRADE_PROTOCOL')
    }

    const amountIn = trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient.toString()
    const amountOut = trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient.toString()

    // logic from hermes-swap-router-sdk. Originally from uniswap-v3-sdk
    // https://github.com/Uniswap/router-sdk/blob/d8eed164e6c79519983844ca8b6a3fc24ebcb8f8/src/swapRouter.ts#L276
    const sections = partitionMixedRouteByProtocol(route as MixedRoute<TInput, TOutput>)
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

      const MixedencodingParams: MixedEncodingParams = {
        route: newRoute,
        recipient: isLastSectionInRoute(i) ? tradeRecipient : getNextSectionRecipient(sections[i + 1]),
        amountIn: i == 0 ? amountIn : CONTRACT_BALANCE,
        amountOut: !isLastSectionInRoute(i) ? '0' : amountOut,
        payerIsUser: payerIsUser && i === 0,
        useContractBalance,
      }

      const addMixedSwapForSection = getAddMixedSwapForSection(newRoute)

      addMixedSwapForSection(planner, MixedencodingParams)
    }
  }
}
