import { ZERO_ADDRESS } from 'maia-core-sdk'

export const UNIVERSAL_ROUTER_ADDRESS = (chainId: number): string => {
  switch (chainId) {
    case 1: // mainnet
      return ZERO_ADDRESS
    case 11155111: // sepolia
      return '0x5181bd48C2070E1f850C4a1F59665f02E4617Cb0'
    case 10: // optimism
      return ZERO_ADDRESS
    case 42161: // arbitrum
      return ZERO_ADDRESS
    default:
      throw new Error(`Universal Router not deployed on chain ${chainId}`)
  }
}
