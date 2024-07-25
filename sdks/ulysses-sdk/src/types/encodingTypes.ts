import { SupportedChainId } from 'maia-core-sdk'

// Define the default gas params type.
export type gasParamsMap = { [chainId in SupportedChainId]: GasParams }

/**
 * Interface for the object that holds the output token params.
 * @param settlementOwner The address of the settlement owner.
 * @param recipient The address of the recipient of the output tokens.
 * @param outputToken The address of the output token.
 * @param amountOut The amount of output tokens.
 * @param depositOut The amount of deposit tokens.
 * @param dstChainId The chain id of the destination chain.
 * @param gasParams The gas params for the call to the destination branch chain.
 */
export interface IOutputTokenParams {
  settlementOwner: string
  recipient: string
  outputToken: string
  amountOut: string
  depositOut: string
  dstChainId: number
  gasParams: GasParams
}

/**
 * Interface for the object that holds the multiple output token params.
 * @param settlementOwner The address of the settlement owner.
 * @param recipient The address of the recipient of the output tokens.
 * @param outputTokens The addresses of the output tokens.
 * @param amountsOut The amounts of output tokens.
 * @param depositsOut The amounts of deposit tokens.
 * @param dstChainId The chain id of the destination chain.
 * @param gasParams The gas params for the call to the destination branch chain.
 */
export interface IOutputMultipleTokenParams {
  settlementOwner: string
  recipient: string
  outputTokens: string[]
  amountsOut: string[]
  depositsOut: string[]
  dstChainId: number
  gasParams: GasParams
}

/**
 * Default params of an interaction with the branch router.
 */
export interface IMulticallCall {
  /**
   * The target contract address for the call.
   */
  target: string

  /**
   * The encoded data for the call.
   */
  callData: string
}
export interface IPayableCall {
  target: string
  callData: string
  value: string
}
/**
 * Interface for the call of functions that require no output of tokens
 */
export interface IMulticallNoOutputParams {
  /**
   * Represents the funcId Eg: "0x1"
   */
  funcId: string

  /**
   * Holds and array of calls to perform
   */
  callData: IMulticallCall[]
}

/**
 * Interface for the `params` of functions that have a single output
 */
export interface IMulticallSingleOutputParams extends IMulticallNoOutputParams {
  outputParams: IOutputTokenParams
}

/**
 *  Interface for the call of functions that require multiple outputs of tokens.
 */
export interface IMulticallMultipleOutputParams extends IMulticallNoOutputParams {
  outputParams: IOutputMultipleTokenParams
}

/**
 * Interface for the `params` of the branch router functions.
 */
export type IDefaultParams = IMulticallNoOutputParams | IMulticallSingleOutputParams | IMulticallMultipleOutputParams

/**
 * Type for all deposit or settlement params.
 */
export type ITokenParams =
  | ISingleDepositParams
  | IMultipleDepositParams
  | ISingleSettlementParams
  | IMultipleSettlementParams

/**
 * Type for the output params of the branch router functions.
 */
export type ITokenOutputParams = IOutputTokenParams | IOutputMultipleTokenParams

/**
 * Type for the exisitng token deposit parmas.
 */
export type ITokenDepositParams = ISingleDepositParams | IMultipleDepositParams

/**
 * Type for the existing token settlement params.
 */
export type ITokenSettlementParams = ISingleSettlementParams | IMultipleSettlementParams

/**
 * Interface for the deposit params that only require 1 asset to be deposited.
 */
export interface ISingleDepositParams {
  /**
   * Input Local hTokens Address.
   */
  hToken: string
  /**
   * Input Native / underlying Token Address.
   */
  token: string
  /**
   * Amount of Local hTokens deposited for interaction.
   */
  amount: string
  /**
   *Amount of native tokens deposited for interaction.
   */
  deposit: string
}

/**
 * Interface for the deposit params that require multiple assets be deposited.
 */
export interface IMultipleDepositParams {
  /**
   * Input Local hTokens Address.
   */
  hTokens: string[]
  /**
   * Input Native / underlying Token Address.
   */
  tokens: string[]

  /**
   * Amount of Local hTokens deposited for interaction.
   */
  amounts: string[]
  /**
   * Amount of native tokens deposited for interaction.
   */
  deposits: string[]
}

/**
 * Interface for the settlement params that only require 1 asset to be deposited.
 */
export interface ISingleSettlementParams {
  /**
   * Input Local hTokens Address.
   */
  hToken: string
  /**
   * Input Native / underlying Token Address.
   */
  token: string
  /**
   * Amount of Local hTokens deposited for interaction.
   */
  amount: string
  /**
   *Amount of native tokens deposited for interaction.
   */
  deposit: string
}

/**
 * Interface for the settlement params that require multiple assets be deposited.
 */
export interface IMultipleSettlementParams {
  /**
   * Input Local hTokens Address.
   */
  hTokens: string[]
  /**
   * Input Native / underlying Token Address.
   */
  tokens: string[]

  /**
   * Amount of Local hTokens deposited for interaction.
   */
  amounts: string[]
  /**
   * Amount of native tokens deposited for interaction.
   */
  deposits: string[]
}

/**
 * Interface for the gas params of the branch bridge agent.
 */
export interface GasParams {
  /**
   * gas allocated for the cross-chain call.
   */
  gasLimit: string

  /**
   * gas allocated for remote branch execution. Must be lower than `gasLimit`.
   */
  remoteBranchExecutionGas: string
}
