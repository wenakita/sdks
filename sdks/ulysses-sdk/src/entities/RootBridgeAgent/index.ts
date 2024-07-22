import { Interface } from '@ethersproject/abi'
import { toHex } from 'maia-core-sdk'

import RootBridgeAgentAbi from '../../abis/RootBridgeAgent.json'
import { IRedeemSettlementParams, IRetrieveSettlementParams, IRootBridgeRetrySettlementParams } from '../../types'
import { formatGasParams } from '../../utils'

export abstract class RootBridgeAgent {
  public static readonly INTERFACE: Interface = new Interface(RootBridgeAgentAbi.abi)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Used to retry call a function on a remote chain.
   * @param gasRefundee The address that will receive the gas refund.
   * @param recipient The address that will receive the tokens.
   * @param dstChainId The chain id of the destination chain.
   * @param params The encoded parameters to pass to the remote chain.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns encoded calldata for the callOut function
   */
  public static encodeRetrySettlementCalldata({
    settlementOwnerAndGasRefundee,
    settlementNonce,
    recipient,
    params,
    gasParams,
    hasFallbackToggled,
  }: IRootBridgeRetrySettlementParams): string {
    return RootBridgeAgent.INTERFACE.encodeFunctionData('retrySettlement', [
      settlementOwnerAndGasRefundee,
      toHex(settlementNonce),
      recipient,
      params,
      formatGasParams(gasParams),
      hasFallbackToggled,
    ])
  }

  /**
   * Used to request tokens back to the root chain after an call fails.
   * @param depositNonce The nonce of the settlement to retrieve.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns encoded calldata for the retrieveSettlement function
   */
  public static encodeRetrieveSettlementCalldata({ settlementNonce, gasParams }: IRetrieveSettlementParams): string {
    return RootBridgeAgent.INTERFACE.encodeFunctionData('retrieveSettlement', [
      toHex(settlementNonce),
      formatGasParams(gasParams),
    ])
  }

  /**
   * Used to transfer tokens from the root port to the owner of the settlement after an call fails.
   * @param depositNonce The nonce of the settlement to retrieve.
   * @param recipient the address that's used for receive the redeemed tokens.
   * @returns encoded calldata for the redeemSettlement function
   */
  public static encodeRedeemSettlementCalldata({ settlementNonce, recipient }: IRedeemSettlementParams): string {
    return RootBridgeAgent.INTERFACE.encodeFunctionData('redeemSettlement', [toHex(settlementNonce), recipient])
  }
}
