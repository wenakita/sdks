import { ComposableStablePool, ComposableStablePoolWrapper, Pair, Pool } from 'hermes-v2-sdk'
import { Currency, NativeToken } from 'maia-core-sdk'

import { MixedRouteSDK, TPool } from '../entities/mixedRoute/route'

export enum EncodingType {
  V2 = 'V2',
  V3 = 'V3',
  BAL_STABLE = 'BAL',
  VAULT = 'ERC4626',
}

// Assuming TPool is the type/interface for pool instances
type PoolConstructor = new (...args: any[]) => TPool

// Mapping of pool constructors to their corresponding EncodingType
const poolTypeToEncodingTypeMap = new Map<PoolConstructor, EncodingType>([
  [Pool, EncodingType.V3],
  [ComposableStablePool, EncodingType.BAL_STABLE],
  [ComposableStablePoolWrapper, EncodingType.VAULT],
  [Pair, EncodingType.V2],
  // Add new pool types here
])

// Function to determine the type group of a pool
export const getTypeGroup = (pool: TPool): EncodingType => {
  for (const [poolConstructor, encodingType] of poolTypeToEncodingTypeMap) {
    if (pool instanceof poolConstructor) {
      return encodingType
    }
  }

  throw new Error('UNRECOGNIZED POOL TYPE')
}

/**
 * Utility function to return each consecutive section of various types of pools in a MixedRoute
 * @param route
 * @returns a nested array of various types of pools in the order of the route
 */
export const partitionMixedRouteByProtocol = (route: MixedRouteSDK<Currency, Currency>): TPool[][] => {
  const pools = route.pools

  return partitionPoolsByProtocol(pools)
}

export function partitionPoolsByProtocol(pools: TPool[]): TPool[][] {
  const acc = []

  let left = 0
  let right = 0

  while (right < pools.length) {
    const leftGroup = getTypeGroup(pools[left])
    const rightGroup = getTypeGroup(pools[right])

    if (leftGroup !== rightGroup) {
      acc.push(pools.slice(left, right))
      left = right
    }

    right++
    if (right === pools.length) {
      acc.push(pools.slice(left, right))
    }
  }

  return acc
}

/**
 * Simple utility function to get the output of an array of Pools
 * @param pools
 * @param firstInputToken
 * @returns the output token of the last pool in the array
 */
export const getOutputOfPools = (pools: TPool[], firstInputToken: NativeToken): NativeToken => {
  const { inputToken: outputToken } = pools.reduce(
    ({ inputToken }, pool: TPool): { inputToken: NativeToken } => {
      if (!pool.involvesToken(inputToken)) throw new Error('PATH')
      const outputToken: NativeToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      return {
        inputToken: outputToken,
      }
    },
    { inputToken: firstInputToken }
  )
  return outputToken
}

export { UNIVERSAL_ROUTER_ADDRESS } from './constants'
