import { IProtocolAddresses, ProtocolAddressesType } from '../basic'

export interface IBalancer extends IProtocolAddresses {
  ComposableStablePoolWrapperFactory: string
  ComposableStablePoolWrapperInitCodeHash: string
}

export type BalancerAddressesType = ProtocolAddressesType<IBalancer>
