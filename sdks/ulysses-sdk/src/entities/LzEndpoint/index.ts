import { defaultAbiCoder, Interface } from '@ethersproject/abi'
import { pack } from '@ethersproject/solidity'

import LayerZeroEndpointABI from '../../abis/LayerZeroEndpoint.json'
import {
  IBranchRouterCallOutAndBridgeMultipleParams as IBranchCallOutAndBridgeMultipleParams,
  ICallOutAndBridgeParams as IBranchCallOutAndBridgeParams,
} from '../../types/baseBranchRouterTypes'
import {
  ICallOutSignedAndBridgeMultipleParams,
  ICallOutSignedAndBridgeParams,
  IRetrieveDepositParams,
  IRetrySettlementParams,
} from '../../types/branchBridgeAgentTypes'
import {
  IRetrieveSettlementParams,
  IRootBridgeCallOutAndBridgeMultipleParams as IRootCallOutAndBridgeMultipleParams,
  IRootBridgeCallOutAndBridgeParams as IRootCallOutAndBridgeParams,
} from '../../types/rootBridgeAgentTypes'
import { BranchBridgeAgent } from '../BranchBridgeAgent'
import { RootBridgeAgent } from '../RootBridgeAgent'

/**
 * Class to create the calldata to pass as argument for a given call to the branch router.
 */
export abstract class LzEndpoint {
  public static readonly INTERFACE: Interface = new Interface(LayerZeroEndpointABI.abi)

  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {
    /* TODO document why this constructor is empty */
  }

  /**
   * Produces the encoded bytes for version 2 adapter params.
   * @param gasLimit
   * @param nativeForDst
   * @param dstNativeAddress
   * @returns encoded adapter params.
   */
  public static encodeAdapterParamsV2(gasLimit: string, nativeForDst: string, dstNativeAddress: string): string {
    return pack(['uint16', 'uint256', 'uint256', 'address'], [2, gasLimit, nativeForDst, dstNativeAddress])
  }

  /**
   * Produces the  calldata for an onchain call to the endpoint's `estimateFess` function.
   * @param dstChainId The id of the destination chain.
   * @param bridgeAgentAddress The address of the bridge agent on the source chain.
   * @param payload The payload to pass to the endpoint's `estimateFees` function and would be used in the `send` call.
   * @param gasLimit The gas limit to pass to the endpoint's `estimateFees` function and would be used in the `send` call.
   * @param nativeForDst The amount of native tokens to receive in destination chain.
   * @returns
   */
  public static createEstimateFeesCalldata(
    dstChainId: number,
    bridgeAgentAddress: string,
    payload: string,
    gasLimit: string,
    nativeForDst: string,
    dstNativeAddress: string
  ): string {
    return LzEndpoint.INTERFACE.encodeFunctionData('estimateFees', [
      dstChainId,
      bridgeAgentAddress,
      payload,
      false,
      LzEndpoint.encodeAdapterParamsV2(gasLimit, nativeForDst, dstNativeAddress),
    ])
  }

  /**
   * Produces the endpoint calldata for a call that does not require a token deposit.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param params The parameters to pass to the branch router function.
   * @returns encoded endpoint calldata for the callOut function.
   */
  public static createCallOutLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    params: string
  ): string {
    const payload = pack(['bytes1', 'uint32', 'bytes'], [1, nonce, params])

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the endpoint calldata for a call that requires a token deposit.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit token and amount.
   * @returns endpoint calldata for the callOutAndBridge function
   */
  public static createCallOutAndBridgeLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    { params, depositParams }: IBranchCallOutAndBridgeParams
  ): string {
    const payload = pack(
      ['bytes1', 'uint32', 'address', 'address', 'uint256', 'uint256', 'bytes'],
      [2, nonce, depositParams.hToken, depositParams.token, depositParams.amount, depositParams.deposit, params]
    )

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the endpoint calldata to pass as argument for a call that requires multiple token deposits.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit tokens and amounts.
   * @returns endpoint calldata for the callOutAndBridgeMultiple function
   */
  public static createBranchCallOutAndBridgeMultipleLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    { params, depositParams }: IBranchCallOutAndBridgeMultipleParams
  ): string {
    const payload = pack(
      ['bytes1', 'uint8', 'uint32', 'address[]', 'address[]', 'uint256[]', 'uint256[]', 'bytes'],
      [
        3,
        nonce,
        depositParams.hTokens.length,
        depositParams.hTokens,
        depositParams.tokens,
        depositParams.amounts,
        depositParams.deposits,
        params,
      ]
    )

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the on-chain calldata to pass as argument for a signed call (using the user's Virtual Account)
   * that does not require a token deposit.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param account The user's account as deposit owner and gas refundee.
   * @param params The parameters to pass to the branch router function.
   * @returns endpoint calldata for the callOutSigned function
   */
  public static createBranchCallOutSignedLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    account: string,
    params: string
  ): string {
    const payload = pack(['bytes1', 'address', 'uint32', 'bytes'], [4, account, nonce, params])

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the on-chain calldata to pass as argument for a signed call (using the user's Virtual Account) that requires a token deposit.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param account user account that's used for the refund of gas if applicable
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit token and amount.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @param hasFallbackToggled true if the call should send a fallback message to clear assets in origin chain upon failure.
   * @returns
   */
  public static createBranchCallOutSignedAndBridgeLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    account: string,
    { params, depositParams, hasFallbackToggled }: ICallOutSignedAndBridgeParams
  ): string {
    const payload = pack(
      ['bytes1', 'address', 'uint32', 'address', 'address', 'uint256', 'uint256', 'bytes'],
      [
        hasFallbackToggled ? '0x85' : '0x05',
        account,
        nonce,
        depositParams.hToken,
        depositParams.token,
        depositParams.amount,
        depositParams.deposit,
        params,
      ]
    )

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the on-chain calldata to pass as argument for a signed call (using the user's Virtual Account)
   * that requires multiple token deposits.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit tokens and amounts.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @param hasFallbackToggled true if the call should send a fallback message to clear assets in origin chain upon failure.
   * @returns
   */
  public static createBranchCallOutSignedAndBridgeMultipleLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    account: string,
    { params, depositParams, hasFallbackToggled }: ICallOutSignedAndBridgeMultipleParams
  ): string {
    const payload = pack(
      ['bytes1', 'address', 'uint8', 'uint32', 'address[]', 'address[]', 'uint256[]', 'uint256[]', 'bytes'],
      [
        hasFallbackToggled ? '0x86' : '0x06',
        account,
        depositParams.hTokens.length,
        nonce,
        depositParams.hTokens,
        depositParams.tokens,
        depositParams.amounts,
        depositParams.deposits,
        params,
      ]
    )

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Used to encode enpoint calldata for the retry of a failed settlement.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param account The user's account as deposit owner and gas refundee.
   * @param settlementNonce The nonce of the settlement to retry.
   * @param params The parameters to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @param hasFallbackToggled true if the call should send a fallback message to clear assets in origin chain upon failure.
   * @returns encoded calldata for the retrySettlement function
   */
  public static createBranchRetrySettlementEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    account: string,
    { settlementNonce, params, gasParams, hasFallbackToggled }: IRetrySettlementParams
  ): string {
    const payload = defaultAbiCoder.encode(
      ['uint32', 'address', 'bytes', 'tuple(uint256, uint256)'],
      [settlementNonce, account, params, [gasParams.gasLimit, gasParams.remoteBranchExecutionGas]]
    )

    const packedPayload = pack(['bytes1', 'bytes'], [hasFallbackToggled ? '0x87' : '0x07', payload])

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, packedPayload])
  }

  /**
   * Used encode enpoint calldata for deposit retrieval request.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param account The user's account as deposit owner and gas refundee.
   * @param depositNonce The nonce of the deposit to retrieve.
   * @returns encoded calldata for the retrieveDeposit function
   */
  public static createBranchRetrieveDepositEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    account: string,
    { depositNonce }: IRetrieveDepositParams
  ): string {
    const payload = pack(['bytes1', 'address', 'uint32'], [8, account, depositNonce])

    return RootBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the endpoit calldata for a call that does not require a token deposit.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param recipient The recipient account as deposit owner and gas refundee.
   * @param params The parameters to pass to the branch router function.
   */
  public static createRootCallOutLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    recipient: string,
    params: string
  ): string {
    const payload = pack(['bytes1', 'address', 'uint32', 'bytes'], [1, recipient, nonce, params])

    return BranchBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the endpoint calldata for a call that requires a token deposit.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param recipient The recipient account of the settlement tokens.
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param settlementParams params that hold information about the settlement token and amount.
   * @param hasFallbackToggled send fallback message to clear assets in origin chain upon failure.
   * @returns encoded endpoint calldata for the callOutAndBridge function
   */
  public static createRootCallOutAndBridgeLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    { recipient, params, settlementParams, hasFallbackToggled }: IRootCallOutAndBridgeParams
  ): string {
    const payload = pack(
      ['bytes1', 'address', 'uint32', 'address', 'address', 'uint256', 'uint256', 'bytes'],
      [
        hasFallbackToggled ? '0x82' : '0x02',
        recipient,
        nonce,
        settlementParams.hToken,
        settlementParams.token,
        settlementParams.amount,
        settlementParams.deposit,
        params,
      ]
    )

    return BranchBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  /**
   * Produces the endpoint calldata for a call that requires multiple token deposits.
   * @param srcChainId The id of the source branch chain.
   * @param srcAddress The address of the source branch chain encode packed with the destination address.
   * @param nonce The nonce of the deposit to encode.
   * @param recipient The recipient account of the settlement tokens.
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param settlementParams params that hold information about the settlement tokens and amounts.
   * @param hasFallbackToggled send fallback message to clear assets in origin chain upon failure.
   * @returns encoded endpoint calldata for the callOutAndBridgeMultiple function
   */
  public static createRootCallOutAndBridgeMultipleLzEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    nonce: number,
    { recipient, params, settlementParams, hasFallbackToggled }: IRootCallOutAndBridgeMultipleParams
  ): string {
    const payload = pack(
      ['bytes1', 'address', 'uint8', 'uint32', 'address[]', 'address[]', 'uint256[]', 'uint256[]', 'bytes'],
      [
        hasFallbackToggled ? '0x83' : '0x03',
        recipient,
        settlementParams.hTokens.length,
        nonce,
        settlementParams.hTokens,
        settlementParams.tokens,
        settlementParams.amounts,
        settlementParams.deposits,
        params,
      ]
    )

    return BranchBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }

  public static createRootRetrieveSettlementEndpointCalldata(
    srcChainId: number,
    srcAddress: string,
    { settlementNonce }: IRetrieveSettlementParams
  ): string {
    const payload = pack(['bytes1', 'uint32'], [4, settlementNonce])

    return BranchBridgeAgent.INTERFACE.encodeFunctionData('lzReceive', [srcChainId, srcAddress, 0, payload])
  }
}
