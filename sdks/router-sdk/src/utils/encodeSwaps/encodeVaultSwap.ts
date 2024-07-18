/* eslint-disable @typescript-eslint/no-unused-vars */
import { Trade as V3Trade, TradeType, Vault } from 'hermes-v2-sdk'
import { Currency } from 'maia-core-sdk'

import { SwapOptions } from '../../swapRouter'

/**
 * @notice Generates the calldata for a Swap with a V3 Route.
 * @param _trade The V3Trade to encode.
 * @param _options SwapOptions to use for the trade.
 * @param _routerMustCustody Flag for whether funds should be sent to the router
 * @param _performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
 * @returns A string array of calldatas for the trade.
 */
export function encodeVaultSwap(
  _trade: V3Trade<Vault, Currency, Currency, TradeType>,
  _options: SwapOptions,
  _routerMustCustody: boolean,
  _performAggregatedSlippageCheck: boolean
): string[] {
  throw new Error('UNSUPPORTED_SWAP_ROUTER_POOL_TYPE')
}
