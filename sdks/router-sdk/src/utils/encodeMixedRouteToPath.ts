import { pack } from '@ethersproject/solidity'
import { Pool } from 'hermes-v2-sdk'
import { Currency, NativeToken } from 'maia-core-sdk'

import { V2_FEE_PATH_PLACEHOLDER } from '../constants'
import { MixedRouteSDK, TPool } from '../entities/mixedRoute/route'

/**
 * Converts a route to a hex encoded path
 * @notice only supports exactIn route encodings
 * @param route the mixed path to convert to an encoded path
 * @returns the exactIn encoded path
 */
export function encodeMixedRouteToPath(route: MixedRouteSDK<Currency, Currency>): string {
  const firstInputToken: NativeToken = route.input.wrapped

  const { path, types } = route.pools.reduce(
    (
      { inputToken, path, types }: { inputToken: NativeToken; path: (string | number)[]; types: string[] },
      pool: TPool,
      index
    ): { inputToken: NativeToken; path: (string | number)[]; types: string[] } => {
      const outputToken: NativeToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER, outputToken.address],
        }
      } else {
        return {
          inputToken: outputToken,
          types: [...types, 'uint24', 'address'],
          path: [...path, pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER, outputToken.address],
        }
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  return pack(types, path)
}
