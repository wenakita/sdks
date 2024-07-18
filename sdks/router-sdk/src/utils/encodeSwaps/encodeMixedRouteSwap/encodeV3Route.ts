import { Pool } from 'hermes-v2-sdk'

import { encodeMixedRouteToPath } from '../../encodeMixedRouteToPath'
import { SWAP_ROUTER_INTERFACE } from '../SWAP_ROUTER_INTERFACE'
import { EncodingParams } from '.'

// Encoding function for a V3 Pool
export function encodeV3Route(encodingParams: EncodingParams): string {
  const exactInputSingleParams = {
    tokenIn: encodingParams.route.path[0].address,
    tokenOut: encodingParams.route.path[1].address,
    fee: (encodingParams.route.pools as Pool[])[0].fee,
    recipient: encodingParams.recipient,
    amountIn: encodingParams.amountIn,
    amountOutMinimum: encodingParams.amountOutMinimum,
    sqrtPriceLimitX96: 0,
  }

  return SWAP_ROUTER_INTERFACE.encodeFunctionData('exactInputSingle', [exactInputSingleParams])
}

export function encodeMixedV3Route(encodingParams: EncodingParams): string {
  const path: string = encodeMixedRouteToPath(encodingParams.route)
  const exactInputParams = {
    path,
    // By default router holds funds until the last swap, then it is sent to the recipient
    // special case exists where we are unwrapping WETH output, in which case `routerMustCustody` is set to true
    // and router still holds the funds. That logic bundled into how the value of `recipient` is calculated
    recipient: encodingParams.recipient,
    amountIn: encodingParams.amountIn,
    amountOutMinimum: encodingParams.amountOutMinimum,
  }

  return SWAP_ROUTER_INTERFACE.encodeFunctionData('exactInput', [exactInputParams])
}
