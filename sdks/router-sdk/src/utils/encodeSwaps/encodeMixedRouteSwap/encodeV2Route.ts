import { SWAP_ROUTER_INTERFACE } from '../SWAP_ROUTER_INTERFACE'
import { EncodingParams } from '.'

// Encoding function for a V2 Pool
export function encodeV2Route(encodingParams: EncodingParams): string {
  const path = encodingParams.route.path.map((token) => token.address)

  const exactInputParams = [encodingParams.amountIn, encodingParams.amountOutMinimum, path, encodingParams.recipient]

  return SWAP_ROUTER_INTERFACE.encodeFunctionData('swapExactTokensForTokens', exactInputParams)
}

export function encodeMixedV2Route(encodingParams: EncodingParams): string {
  const exactInputParams = [
    encodingParams.amountIn, // amountIn
    encodingParams.amountOutMinimum, // amountOutMin
    encodingParams.route.path.map((token) => token.address), // path
    encodingParams.recipient, // to
  ]

  return SWAP_ROUTER_INTERFACE.encodeFunctionData('swapExactTokensForTokens', exactInputParams)
}
