import { BalancerAddressesType, IBalancer } from '../../types'
import { SupportedChainId } from '../chainIds'

/**
 * These addresses are on arbitrum
 */
export const ArbitrumBalancerAddresses: IBalancer = {
  ComposableStablePoolWrapperFactory: '0x00Dccc0053C2Fa9b0000085a00bD15F200961af0',
}

/**
 * These addresses are on sepolia
 */
export const SepoliaBalancerAddresses: IBalancer = {
  ComposableStablePoolWrapperFactory: '0x996AAA029f3A8826C22CcCf6127A16A0e52FC3Da',
}

export const BalancerAddresses: BalancerAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: ArbitrumBalancerAddresses,
  [SupportedChainId.SEPOLIA]: SepoliaBalancerAddresses,
}
