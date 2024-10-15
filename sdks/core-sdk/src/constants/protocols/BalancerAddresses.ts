import { BalancerAddressesType, IBalancer } from '../../types'
import { SupportedChainId } from '../chainIds'

/**
 * These addresses are on arbitrum
 */
export const ArbitrumBalancerAddresses: IBalancer = {
  ComposableStablePoolWrapperFactory: '0x0FeC6De5Cf270000460000008f0033B910004797',
  ComposableStablePoolWrapperInitCodeHash: '0x486597d0dac9e727fb360962435de36b40a335916fd13eb350993c76512b55c0',
}

/**
 * These addresses are on sepolia
 */
export const SepoliaBalancerAddresses: IBalancer = {
  ComposableStablePoolWrapperFactory: '0x996AAA029f3A8826C22CcCf6127A16A0e52FC3Da',
  ComposableStablePoolWrapperInitCodeHash: '0x2f29c1929bc70aae113b1671d9250cc3e2ab673d22188542ebf28ded1ac9e1a4',
}

export const BalancerAddresses: BalancerAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: ArbitrumBalancerAddresses,
  [SupportedChainId.SEPOLIA]: SepoliaBalancerAddresses,
}
