import { pack } from '@ethersproject/solidity'
import { Currency, NativeToken } from 'maia-core-sdk'

import { Pool } from '../entities/pool'
import { IPool, Route } from '../entities/route'

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */
export function encodeRouteToPath(route: Route<IPool, Currency, Currency>, exactOutput: boolean): string {
  const firstInputToken: NativeToken = route.input.wrapped

  const { path, types } = (route.pools as Pool[]).reduce(
    (
      { inputToken, path, types }: { inputToken: NativeToken; path: (string | number)[]; types: string[] },
      pool: Pool,
      index
    ): { inputToken: NativeToken; path: (string | number)[]; types: string[] } => {
      const outputToken: NativeToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, pool.fee, outputToken.address],
        }
      } else {
        return {
          inputToken: outputToken,
          types: [...types, 'uint24', 'address'],
          path: [...path, pool.fee, outputToken.address],
        }
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  return exactOutput ? pack(types.reverse(), path.reverse()) : pack(types, path)
}
