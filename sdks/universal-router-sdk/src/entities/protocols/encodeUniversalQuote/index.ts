import { BigNumber } from '@ethersproject/bignumber'
import {
  EncodingType,
  getOutputOfPools,
  getTypeGroup,
  IRoute,
  MixedRoute,
  MixedRouteSDK,
  partitionMixedRouteByProtocol,
  TPool,
} from 'hermes-swap-router-sdk'
import { TradeType } from 'hermes-v2-sdk'
import { Currency, CurrencyAmount, NativeToken } from 'maia-core-sdk'

import { QuotePlanner } from '../../../utils/quoterCommands'
import { addStableMixedQuote, addStableQuote } from './addStableQuote'
import { addV3MixedQuote, addV3Quote } from './addV3Quote'
import { addVaultMixedQuote, addVaultQuote } from './addVaultQuote'

export type SingleEncodingParams<TInput extends Currency, TOutput extends Currency> = {
  route: IRoute<TInput, TOutput, TPool>
  amount: CurrencyAmount<TInput>
  tradeType: TradeType
}

export type EncodingParams<TInput extends Currency, TOutput extends Currency> = {
  route: IRoute<TInput, TOutput, TPool>
  amounts: CurrencyAmount<TInput>[]
  tradeType: TradeType
}

export type MixedEncodingParams = {
  route: MixedRoute<NativeToken, NativeToken>
  amountIn: string | BigNumber
}

function unsupportedPoolType<TInput extends Currency, TOutput extends Currency>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _planner: QuotePlanner,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _params: SingleEncodingParams<TInput, TOutput>
) {
  throw new Error('UNSUPPORTED_SWAP_ROUTER_POOL_TYPE')
}

function unsupportedMixedPoolType(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _planner: QuotePlanner,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _params: MixedEncodingParams
) {
  throw new Error('UNSUPPORTED_SWAP_ROUTER_MIXED_POOL_TYPE')
}

// Mapping of pool types to their encoding functions
const poolEncodingStrategies = {
  [EncodingType.V3]: addV3Quote,
  [EncodingType.BAL_STABLE]: addStableQuote,
  [EncodingType.VAULT]: addVaultQuote,
  [EncodingType.V2]: unsupportedPoolType,
  // Add new pool types and their corresponding functions here
}

// Mapping of pool types to their encoding functions for mixed routes
const mixedPoolEncodingStrategies = {
  [EncodingType.V3]: addV3MixedQuote,
  [EncodingType.BAL_STABLE]: addStableMixedQuote,
  [EncodingType.VAULT]: addVaultMixedQuote,
  [EncodingType.V2]: unsupportedMixedPoolType,
  // Add new pool types and their corresponding functions here
}

// Function to determine the encoding strategy for a given route
export function getAddQuoteForRoute(route: MixedRouteSDK<Currency, Currency>) {
  const typeGroup: EncodingType = getTypeGroup(route.pools[0]) // Assuming all pools in a route are of the same type
  const addQuoteForRoute = poolEncodingStrategies[typeGroup]

  if (!addQuoteForRoute) {
    throw new Error(`No encoding strategy found for pool type: ${typeGroup}`)
  }

  return addQuoteForRoute
}

// Function to determine the encoding strategy for a given route
function getAddUniversalQuoteForSection<TInput extends Currency, TOutput extends Currency>(
  route: MixedRouteSDK<TInput, TOutput>
): (planner: QuotePlanner, encodingParams: MixedEncodingParams) => void {
  const typeGroup: EncodingType = getTypeGroup(route.pools[0]) // Assuming all pools in a route are of the same type
  const addUniversalQuoteForSection = mixedPoolEncodingStrategies[typeGroup]

  if (!addUniversalQuoteForSection) {
    throw new Error(`No encoding strategy found for pool type: ${typeGroup}`)
  }

  return addUniversalQuoteForSection
}

// encode a mixed route swap, i.e. including both stable, erc4626, v2 and v3 pools
export function encodeUniversalQuote<TInput extends Currency, TOutput extends Currency>({
  route,
  amounts,
  tradeType,
}: EncodingParams<TInput, TOutput>): [string, string[]][] {
  const planners: QuotePlanner[] = encodeQuote<TInput, TOutput>(route, amounts, tradeType)

  return planners.map((planner) => [planner.commands, planner.inputs])
}

// encode a mixed route swap, i.e. including both stable, erc4626, v2 and v3 pools
export function encodeUniversalQuoteCalldata<TInput extends Currency, TOutput extends Currency>({
  route,
  amounts,
  tradeType,
}: EncodingParams<TInput, TOutput>): string[] {
  const planners: QuotePlanner[] = encodeQuote<TInput, TOutput>(route, amounts, tradeType)

  return planners.map((planner) => planner.encodePlan())
}

// TODO: Optimize this
function encodeQuote<TInput extends Currency, TOutput extends Currency>(
  route: IRoute<TInput, TOutput, TPool>,
  amounts: CurrencyAmount<TInput>[],
  tradeType: TradeType
) {
  const planners: QuotePlanner[] = []

  // single hop, so it can be reduced to plain single swap logic
  if (route.pools.length === 1) {
    const addQuoteForRoute = getAddQuoteForRoute(route as MixedRoute<TInput, TOutput>)

    for (let amountIndex = 0; amountIndex < amounts.length; amountIndex++) {
      planners.push(new QuotePlanner())
      const params: SingleEncodingParams<TInput, TOutput> = { route, amount: amounts[amountIndex], tradeType }
      addQuoteForRoute(planners[amountIndex], params)
    }
  } else {
    // logic from hermes-swap-router-sdk. Originally from uniswap-v3-sdk
    // https://github.com/Uniswap/router-sdk/blob/d8eed164e6c79519983844ca8b6a3fc24ebcb8f8/src/swapRouter.ts#L276
    const sections = partitionMixedRouteByProtocol(route as MixedRoute<TInput, TOutput>)

    let outputToken
    let inputToken = route.input.wrapped

    for (let amountIndex = 0; amountIndex < amounts.length; amountIndex++) {
      planners.push(new QuotePlanner())
    }

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

      const addUniversalQuoteForSection = getAddUniversalQuoteForSection(newRoute)

      for (let amountIndex = 0; amountIndex < amounts.length; amountIndex++) {
        const MixedencodingParams: MixedEncodingParams = {
          route: newRoute,
          amountIn: i == 0 ? amounts[amountIndex].quotient.toString() : '0',
        }

        addUniversalQuoteForSection(planners[amountIndex], MixedencodingParams)
      }
    }
  }

  return planners
}
