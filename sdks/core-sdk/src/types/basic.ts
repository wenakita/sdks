import { SupportedChainId } from '../constants'

// Define the basic protocol addresses type.
export interface IProtocolAddresses {
  [contractName: string]: string
}

// Define the basic chain ID to layerzero chain ID map type or vice versa.
export type chainIdMap = { [chainId: number]: number }

export type ProtocolAddressesType<T> = {
  [K in SupportedChainId]?: T
}
