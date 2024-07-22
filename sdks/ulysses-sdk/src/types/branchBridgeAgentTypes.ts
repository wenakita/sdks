import { GasParams, IMultipleDepositParams, ISingleDepositParams } from '../types/encodingTypes'

export interface IVirtualAcountGasParams {
  gasLimit: number
  remoteBranchExecutionGas: number
}

export interface ICallOutSignedAndBridgeParams {
  params: string
  depositParams: ISingleDepositParams
  gasParams: GasParams
  hasFallbackToggled?: boolean
}

export interface ICallOutSignedAndBridgeMultipleParams {
  params: string
  depositParams: IMultipleDepositParams
  gasParams: GasParams
  hasFallbackToggled: boolean
}

export interface IRetryDepositSignedParams {
  depositNonce: number
  params: string
  gasParams: GasParams
  hasFallbackToggled: boolean
}

export interface IRetrieveDepositParams {
  depositNonce: number
  gasParams: GasParams
}

export interface IRedeemDepositParams {
  depositNonce: number
  account: string
}

export interface IRedeemDepositSingleParams {
  depositNonce: number
  account: string
  localToken: string
}

export interface IRetrySettlementParams {
  settlementNonce: number
  params: string
  gasParams: GasParams
  hasFallbackToggled: boolean
}
