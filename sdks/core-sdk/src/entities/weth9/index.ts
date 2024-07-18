import { NativeToken } from '../tokens/nativeToken'

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WETH9: { [chainId: number]: NativeToken } = {
  [1]: new NativeToken(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
  [3]: new NativeToken(3, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
  [4]: new NativeToken(4, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
  [5]: new NativeToken(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
  [42]: new NativeToken(42, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'),

  [10]: new NativeToken(10, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
  [69]: new NativeToken(69, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),

  [42161]: new NativeToken(42161, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
  [421611]: new NativeToken(421611, '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681', 18, 'WETH', 'Wrapped Ether'),
}
