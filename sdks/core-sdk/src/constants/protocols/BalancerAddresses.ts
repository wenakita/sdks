import { BalancerAddressesType, IBalancer } from '../../types'
import { SupportedChainId } from '../chainIds'

/**
 * These addresses are on arbitrum
 */
export const SepoliaBalancerAddresses: IBalancer = {
  ComposableStablePoolWrapperFactory: '0xF35c3D4d862aDEA5cBb8D0df472CBC9C9A5F331F',
}

/**
 * These addresses are on sepolia
 */
export const ArbitrumBalancerAddresses: IBalancer = {
  ComposableStablePoolWrapperFactory: '0x996AAA029f3A8826C22CcCf6127A16A0e52FC3Da',
}

export const BalancerAddresses: BalancerAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: ArbitrumBalancerAddresses,
  [SupportedChainId.SEPOLIA]: SepoliaBalancerAddresses,
}
