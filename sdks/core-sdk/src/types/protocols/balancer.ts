import { IProtocolAddresses, ProtocolAddressesType } from '../basic'

export interface IBalancer extends IProtocolAddresses {
  ComposableStablePoolWrapperFactory: string
}

export type BalancerAddressesType = ProtocolAddressesType<IBalancer>
