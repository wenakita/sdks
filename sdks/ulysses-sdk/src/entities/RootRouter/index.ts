import { defaultAbiCoder, Interface } from '@ethersproject/abi'
import { pack } from '@ethersproject/solidity'
import { LibZip } from 'solady'

import RootRouterAbi from '../../abis/MulticallRootRouter.json'
import { MULTICALL_FUNCID } from '../../constants'
import {
  IRootRouterCallOutAndBridgeMultipleParams,
  IRootRouterCallOutAndBridgeParams,
  IRootRouterRetrySettlementParams,
} from '../../types'
import { IMulticallCall, IOutputMultipleTokenParams, IOutputTokenParams } from '../../types/encodingTypes'
import { formatGasParams } from '../../utils'

export abstract class RootRouter {
  public static readonly INTERFACE: Interface = new Interface(RootRouterAbi.abi)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Used to call out to a destination branch router and bridge a single token.
   * @param settlementOwnerAndGasRefundee The address that will receive the gas refund and the settlement owner.
   * @param recipient The address of the account that will receive the output tokens in destination branch chain.
   * @param outputToken The address of the output token.
   * @param amountOut The amount of output tokens to be received.
   * @param depositOut The amount of deposit tokens to be bridged.
   * @param dstChainId The id of the destination branch chain.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns encoded calldata for the callOutAndBridge function.
   */
  public static encodeCallOutAndBridgeCalldata({
    settlementOwnerAndGasRefundee,
    recipient,
    outputToken,
    amountOut,
    depositOut,
    dstChainId,
    gasParams,
  }: IRootRouterCallOutAndBridgeParams): string {
    return RootRouter.INTERFACE.encodeFunctionData('callOutAndBridge', [
      settlementOwnerAndGasRefundee,
      recipient,
      outputToken,
      amountOut,
      depositOut,
      dstChainId,
      formatGasParams(gasParams),
    ])
  }

  /**
   * Used to call out to a destination branch router and bridge multiple tokens.
   * @param settlementOwnerAndGasRefundee The address that will receive the gas refund and the settlement owner.
   * @param recipient The address of the account that will receive the output tokens in destination branch chain.
   * @param outputTokens The addresses of the output tokens.
   * @param amountsOut The amounts of output tokens to be received.
   * @param depositsOut The amounts of deposit tokens to be bridged.
   * @param dstChainId The id of the destination branch chain.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns encoded calldata for the callOutAndBridgeMultiple function.
   */
  public static encodeCallOutAndBridgeMultipleCalldata({
    settlementOwnerAndGasRefundee,
    recipient,
    outputTokens,
    amountsOut,
    depositsOut,
    dstChainId,
    gasParams,
  }: IRootRouterCallOutAndBridgeMultipleParams): string {
    return RootRouter.INTERFACE.encodeFunctionData('callOutAndBridgeMultiple', [
      settlementOwnerAndGasRefundee,
      recipient,
      outputTokens,
      amountsOut,
      depositsOut,
      dstChainId,
      formatGasParams(gasParams),
    ])
  }

  /**
   * Used to retry a failed settlement.
   * @param settlementNonce The nonce of the settlement to retry.
   * @param recipient The address of the account that will receive the output tokens in destination branch chain.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @param hasFallbackToggled defaults to true
   * @returns encoded calldata for the retrySettlement function
   */
  public static encodeRetrySettlementCalldata({
    settlementNonce,
    recipient,
    gasParams,
    hasFallbackToggled = true,
  }: IRootRouterRetrySettlementParams): string {
    return RootRouter.INTERFACE.encodeFunctionData('retrySettlement', [
      settlementNonce,
      recipient,
      '',
      formatGasParams(gasParams),
      hasFallbackToggled,
    ])
  }

  /**
   * Append funcId to calls for remote execution in a MulticallRootRouter with no token output to another chain.
   * @param calls list of calls to aggregate.
   */
  public static encodeRemoteMulticallNoOutput(calls: IMulticallCall[]): string {
    const encodedCalls = RootRouter.encodeMulticallNoOutput(calls)
    return pack(['bytes1', 'bytes'], [MULTICALL_FUNCID.NO_OUTPUT, encodedCalls])
  }

  /**
   * Append funcId to calls for remote execution in a MulticallRootRouter with no token output to another chain.
   * @param calls list of calls to aggregate.
   */
  public static encodeRemoteMulticallNoOutputLibZip(calls: IMulticallCall[]): string {
    const encodedCalls = LibZip.cdCompress(RootRouter.encodeMulticallNoOutput(calls))
    return pack(['bytes1', 'bytes'], [MULTICALL_FUNCID.NO_OUTPUT, encodedCalls])
  }

  private static encodeMulticallNoOutput(calls: IMulticallCall[]) {
    const formattedCalls = calls.map((call) => [call.target, call.callData])
    const encodedCalls = defaultAbiCoder.encode(['tuple(address, bytes)[]'], [formattedCalls])
    return encodedCalls
  }

  /**
   * Append funcId to calls for remote execution in a MulticallRootRouter with token output to another chain.
   * @param calls list of calls to aggregate.
   * @param outputTokenParams output token params object.
   */
  public static encodeRemoteMulticallWithOutput(
    calls: IMulticallCall[],
    outputTokenParams: IOutputTokenParams
  ): string {
    const encodedCall = RootRouter.encodeMulticallWithOutput(calls, outputTokenParams)
    return pack(['bytes1', 'bytes'], [MULTICALL_FUNCID.SINGLE_OUTPUT, encodedCall])
  }

  public static encodeRemoteMulticallWithOutputLibZip(
    calls: IMulticallCall[],
    outputTokenParams: IOutputTokenParams
  ): string {
    const encodedCall = LibZip.cdCompress(RootRouter.encodeMulticallWithOutput(calls, outputTokenParams))
    return pack(['bytes1', 'bytes'], [MULTICALL_FUNCID.SINGLE_OUTPUT, encodedCall])
  }

  private static encodeMulticallWithOutput(calls: IMulticallCall[], outputTokenParams: IOutputTokenParams) {
    const formattedCalls = calls.map((call) => [call.target, call.callData])
    const encodedCall = defaultAbiCoder.encode(
      [
        'tuple(address, bytes)[]',
        'tuple(address, address, address, uint256, uint256)',
        'uint16',
        'tuple(uint256, uint256)',
      ],
      [
        formattedCalls,
        [
          outputTokenParams.settlementOwner,
          outputTokenParams.recipient,
          outputTokenParams.outputToken,
          outputTokenParams.amountOut,
          outputTokenParams.depositOut,
        ],
        outputTokenParams.dstChainId,
        [outputTokenParams.gasParams.gasLimit, outputTokenParams.gasParams.remoteBranchExecutionGas],
      ]
    )
    return encodedCall
  }

  /**
   * Append funcId to calls for remote execution in a MulticallRootRouter with multiple token outputs to another chain.
   * @param calls list of calls to aggregate.
   * @param outputMultipleTokenParams output token params object.
   */
  public static encodeRemoteMulticallWithMultipleOutput(
    calls: IMulticallCall[],
    outputMultipleTokenParams: IOutputMultipleTokenParams
  ): string {
    const encodedCall = RootRouter.encodeMulticallWithMultipleOutput(calls, outputMultipleTokenParams)

    return pack(['bytes1', 'bytes'], [MULTICALL_FUNCID.MULTIPLE_OUTPUT, encodedCall])
  }
  public static encodeRemoteMulticallWithMultipleOutputLibZip(
    calls: IMulticallCall[],
    outputMultipleTokenParams: IOutputMultipleTokenParams
  ): string {
    const encodedCall = LibZip.cdCompress(
      RootRouter.encodeMulticallWithMultipleOutput(calls, outputMultipleTokenParams)
    )

    return pack(['bytes1', 'bytes'], [MULTICALL_FUNCID.MULTIPLE_OUTPUT, encodedCall])
  }

  private static encodeMulticallWithMultipleOutput(
    calls: IMulticallCall[],
    outputMultipleTokenParams: IOutputMultipleTokenParams
  ) {
    const formattedCalls = calls.map((call) => [call.target, call.callData])
    const encodedCall = defaultAbiCoder.encode(
      [
        'tuple(address, bytes)[]',
        'tuple(address, address, address[], uint256[], uint256[])',
        'uint16',
        'tuple(uint256, uint256)',
      ],
      [
        formattedCalls,
        [
          outputMultipleTokenParams.settlementOwner,
          outputMultipleTokenParams.recipient,
          outputMultipleTokenParams.outputTokens,
          outputMultipleTokenParams.amountsOut,
          outputMultipleTokenParams.depositsOut,
        ],
        outputMultipleTokenParams.dstChainId,
        [outputMultipleTokenParams.gasParams.gasLimit, outputMultipleTokenParams.gasParams.remoteBranchExecutionGas],
      ]
    )
    return encodedCall
  }
}
