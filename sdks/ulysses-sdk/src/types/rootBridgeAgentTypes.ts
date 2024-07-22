import { GasParams, IMultipleSettlementParams, ISingleSettlementParams } from '../types/encodingTypes'

export interface IRootBridgeCallOutParams {
  gasRefundee: string
  recipient: string
  dstChainId: number
  params: string
  gasParams: GasParams
}

export interface IRootBridgeCallOutAndBridgeParams {
  settlementOwnerAndGasRefundee: string
  recipient: string
  dstChainId: number
  params: string
  settlementParams: ISingleSettlementParams
  gasParams: GasParams
  hasFallbackToggled?: boolean
}

export interface IRootBridgeCallOutAndBridgeMultipleParams {
  settlementOwnerAndGasRefundee: string
  recipient: string
  dstChainId: number
  params: string
  settlementParams: IMultipleSettlementParams
  gasParams: GasParams
  hasFallbackToggled: boolean
}

export interface IRootBridgeRetrySettlementParams {
  settlementOwnerAndGasRefundee: string
  settlementNonce: number
  recipient: string
  params: string
  gasParams: GasParams
  hasFallbackToggled: boolean
}

export interface IRetrieveSettlementParams {
  settlementNonce: number
  gasParams: GasParams
}

export interface IRedeemSettlementParams {
  settlementNonce: number
  recipient: string
}
