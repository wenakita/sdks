import { GasParams } from '../types/encodingTypes'

/**
 * Input Parameters for Root Router Call Out Funciton - IRootRouterCallOutParams
 * @param settlementOwnerAndGasRefundee The address that will receive the gas refund.
 * @param recipient The address of the account that will receive the output tokens in destination branch chain.
 * @param outputToken The address of the output token.
 * @param amountOut The amount of output tokens to be received.
 * @param depositOut The amount of deposit tokens to be bridged.
 * @param dstChainId The id of the destination branch chain.
 * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
 */
export interface IRootRouterCallOutAndBridgeParams {
  settlementOwnerAndGasRefundee: string
  recipient: string
  outputToken: string
  amountOut: string
  depositOut: string
  dstChainId: number
  gasParams: GasParams
}

/**
 * Input Parameters for Root Router Call Out Multiple Funciton - IRootRouterCallOutAndBridgeMultipleParams
 * @param settlementOwnerAndGasRefundee The address that will receive the gas refund.
 * @param recipient The address of the account that will receive the output tokens in destination branch chain.
 * @param outputTokens The addresses of the output tokens.
 * @param amountsOut The amounts of output tokens to be received.
 * @param depositsOut The amounts of deposit tokens to be bridged.
 * @param dstChainId The id of the destination branch chain.
 * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
 */
export interface IRootRouterCallOutAndBridgeMultipleParams {
  settlementOwnerAndGasRefundee: string
  recipient: string
  outputTokens: string[]
  amountsOut: string[]
  depositsOut: string[]
  dstChainId: number
  gasParams: GasParams
}

/**
 * Input Parameters for Root Router Retry Settlement Funciton - IRetrySettlementParams
 * @param settlementNonce The nonce of the settlement to retry.
 * @param recipient The address of the account that will receive the output tokens in destination branch chain.
 * @param params The encoded params to pass to the destination branch router.
 * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
 * @param hasFallbackToggled defaults to true
 */
export interface IRootRouterRetrySettlementParams {
  settlementNonce: number
  recipient: string
  gasParams: GasParams
  hasFallbackToggled: boolean
}
