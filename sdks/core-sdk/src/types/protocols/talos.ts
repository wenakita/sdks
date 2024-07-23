import { IProtocolAddresses, ProtocolAddressesType } from '../basic'

export interface ITalos extends IProtocolAddresses {
  TalosStrategyStakedFactory: string
  OptimizerFactory: string
  BoostAggregatorFactory: string
  TalosManagerFactory: string
  FlywheelCoreInstant: string
  TransferAll: string
}

export type TalosAddressesType = ProtocolAddressesType<ITalos>
