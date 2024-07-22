import { GasParams, IMultipleDepositParams, ISingleDepositParams } from '../types/encodingTypes'

export interface ICallOutAndBridgeParams {
  params: string
  depositParams: ISingleDepositParams
  gasParams: GasParams
}

export interface IBranchRouterCallOutAndBridgeMultipleParams {
  params: string
  depositParams: IMultipleDepositParams
  gasParams: GasParams
}
