import { AddressMap, ChainId } from '../../constants'

const DEFAULT_NETWORKS = [ChainId.ARBITRUM_ONE, ChainId.SEPOLIA]
/**
 * @description Constructs a map of addresses for the same address on different networks
 * @private This is used mainly for the router-sdk
 * @param address
 * @param additionalNetworks
 * @returns
 */
export function constructSameAddressMap(address: string, additionalNetworks: ChainId[] = []): AddressMap {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce<AddressMap>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}
