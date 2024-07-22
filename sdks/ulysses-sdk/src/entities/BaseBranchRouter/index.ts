import { defaultAbiCoder, Interface } from '@ethersproject/abi'
import { pack } from '@ethersproject/solidity'
import { MethodReturnParams, toHex } from 'maia-core-sdk'
import { LibZip } from 'solady'

import BaseBranchRouterABI from '../../abis/BaseBranchRouter.json'
import { GasParams, IDefaultParams, IMultipleDepositParams, ISingleDepositParams } from '../../types'
import { IBranchRouterCallOutAndBridgeMultipleParams, ICallOutAndBridgeParams } from '../../types/baseBranchRouterTypes'
import { formatCalls, formatGasParams } from '../../utils/format'
import { multipleDepositInvariantHelper, singleDepositInvariantHelper } from '../../utils/invariantHelpers'

/**
 * Class to create the calldata to pass as argument for a given call to the branch router.
 */
export abstract class BaseBranchRouter {
  public static readonly INTERFACE: Interface = new Interface(BaseBranchRouterABI.abi)
  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   * Encodes the calldata to pass as argument to a BaseBranchRouter attached to a MulticallRootRouter.
   * Produces the on-chain calldata to pass as argument for a call that does not require a token deposit.
   * Eg: Claiming rewards,withdraw liq, etc.
   *
   * @param params The parameters to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   */
  public static encodeCallOutCalldata(params: string, gasParams: GasParams): string {
    return BaseBranchRouter.INTERFACE.encodeFunctionData('callOut', [params, formatGasParams(gasParams)])
  }

  /**
   * Encodes the calldata to pass as argument to a BaseBranchRouter attached to a MulticallRootRouter.
   * Produces the on chain parameters to pass as arguments for a given call that requires a single token deposit.
   * Eg: ERC4626 Deposit, swap, etc.
   *
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit token and amount.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns
   */
  public static encodeCallOutAndBridgeCalldata({ params, depositParams, gasParams }: ICallOutAndBridgeParams): string {
    //performs safety checks
    singleDepositInvariantHelper(depositParams)

    return BaseBranchRouter.INTERFACE.encodeFunctionData('callOutAndBridge', [
      params,
      [depositParams.hToken, depositParams.token, depositParams.amount, depositParams.deposit],
      formatGasParams(gasParams),
    ])
  }

  /**
   * Encodes the calldata to pass as argument to a BaseBranchRouter attached to a MulticallRootRouter.
   * Produces the on chain parameters to pass as arguments for a given call that requires multiple token deposit.
   * Eg: Adding Liquidity, etc.
   *
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit tokens and amounts.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns
   */
  public static encodeCallOutAndBridgeMultipleCalldata({
    params,
    depositParams,
    gasParams,
  }: IBranchRouterCallOutAndBridgeMultipleParams): string {
    //performs safety checks
    multipleDepositInvariantHelper(depositParams)

    return BaseBranchRouter.INTERFACE.encodeFunctionData('callOutAndBridgeMultiple', [
      params,
      [depositParams.hTokens, depositParams.tokens, depositParams.amounts, depositParams.deposits],
      formatGasParams(gasParams),
    ])
  }

  /**
   * Used to request the retry of a failed deposit from the origin branch chain.
   * @param depositNonce The nonce of the deposit to retry.
   * @param params The encoded params to pass to the root router
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns encoded calldata for the retryDeposit function
   */
  public static encodeRetryDepositCalldata(depositNonce: number, params: string, gasParams: GasParams): string {
    return BaseBranchRouter.INTERFACE.encodeFunctionData('retryDeposit', [
      depositNonce,
      params,
      formatGasParams(gasParams),
    ])
  }

  /**
   * Encodes the calldata to pass as argument to a BaseBranchRouter attached to a MulticallRootRouterLibZip.
   * Produces the on-chain calldata to pass as argument for a call that does not require a token deposit.
   * Eg: Claiming rewards,withdraw liq, etc.
   *
   * @param params The parameters to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns the encoded calldata and message value for the call
   *
   */
  public static encodeCallOutLibZipCalldata(params: IDefaultParams, gasParams: GasParams): MethodReturnParams {
    // Format Calls
    const formattedCalls = formatCalls(params.callData)

    // Encoded Calls
    const encodedCalls = LibZip.cdCompress(defaultAbiCoder.encode(['tuple(address, bytes)[]'], [formattedCalls]))

    // Encode Multicall Root Router Parameters, pack Router function ID and compress using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [params.funcId, encodedCalls])

    // Encode the function data.
    const encodedParams = this.encodeCallOutCalldata(libZipEncodedParams, gasParams)

    return { calldata: encodedParams, value: toHex(0) }
  }

  /**
   * Encodes the calldata to pass as argument to a BaseBranchRouter attached to a MulticallRootRouterLibZip.
   * Produces the on chain parameters to pass as arguments for a given call that requires a single token deposit.
   * Eg: ERC4626 Deposit, swap, etc.
   *
   * @param params parameters to pass to the branch router function.
   * @param dParams deposit params to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns the encoded calldata and message value for the call
   */
  public static encodeCallOutAndBridgeLibZipCalldata(
    params: IDefaultParams,
    dParams: ISingleDepositParams,
    gasParams: GasParams
  ): MethodReturnParams {
    // Format Calls
    const formattedCalls = formatCalls(params.callData)

    // Encoded Calls
    const encodedCalls = LibZip.cdCompress(defaultAbiCoder.encode(['tuple(address, bytes)[]'], [formattedCalls]))

    // Encode Multicall Root Router Parameters, pack Router function ID and compress using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [params.funcId, encodedCalls])

    // Encode Branch Router function data.
    const encodedParams = this.encodeCallOutAndBridgeCalldata({
      params: libZipEncodedParams,
      depositParams: dParams,
      gasParams,
    })

    return { calldata: encodedParams, value: toHex(0) }
  }

  /**
   * Encodes the calldata to pass as argument to a BaseBranchRouter attached to a MulticallRootRouterLibZip.
   * Produces the on chain parameters to pass as arguments for a given call that requires multiple token deposit.
   * Eg: Adding Liquidity, etc.
   *
   * @param params parameters to pass to the branch router function.
   * @param mdParams multiple deposit params to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns the encoded calldata and message value for the call
   */
  public static encodeCallOutAndBridgeMultipleLibZipCalldata(
    params: IDefaultParams,
    mdParams: IMultipleDepositParams,
    gasParams: GasParams
  ): MethodReturnParams {
    // Format Calls
    const formattedCalls = formatCalls(params.callData)

    // Encoded Calls
    const encodedCalls = LibZip.cdCompress(defaultAbiCoder.encode(['tuple(address, bytes)[]'], [formattedCalls]))

    // Encode Multicall Root Router Parameters, pack Router function ID and compress using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [params.funcId, encodedCalls])

    // Encode function data with params & mdParams.
    const encodedParams = this.encodeCallOutAndBridgeMultipleCalldata({
      params: libZipEncodedParams,
      depositParams: mdParams,
      gasParams,
    })

    return {
      calldata: encodedParams,
      value: toHex(0),
    }
  }

  /**
   * Used to request the retry of a failed deposit from the origin branch chain to a MulticallRootRouterLibZip.
   * @param depositNonce The nonce of the deposit to retry.
   * @param params The encoded params to pass to the root router
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns encoded calldata for the retryDeposit function
   */
  public static encodeRetryDepositLibZipCalldata(
    depositNonce: number,
    params: IDefaultParams,
    gasParams: GasParams
  ): MethodReturnParams {
    // Format Calls
    const formattedCalls = formatCalls(params.callData)

    // Encoded Calls
    const encodedCalls = LibZip.cdCompress(defaultAbiCoder.encode(['tuple(address, bytes)[]'], [formattedCalls]))

    // Encode Multicall Root Router Parameters, pack Router function ID and compress using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [params.funcId, encodedCalls])

    // Encode the function data.
    const encodedParams = this.encodeRetryDepositCalldata(depositNonce, libZipEncodedParams, gasParams)

    return { calldata: encodedParams, value: toHex(0) }
  }
}
