import { Interface } from '@ethersproject/abi'
import { pack } from '@ethersproject/solidity'
import { MethodReturnParams, toHex } from 'maia-core-sdk'
import { LibZip } from 'solady'

import BranchBridgeAgentABI from '../../abis/BranchBridgeAgent.json'
import {
  ICallOutSignedAndBridgeMultipleParams,
  ICallOutSignedAndBridgeParams,
  IRedeemDepositParams,
  IRedeemDepositSingleParams,
  IRetrieveDepositParams,
  IRetryDepositSignedParams,
  IRetrySettlementParams,
} from '../../types/branchBridgeAgentTypes'
import { GasParams, IMultipleDepositParams, ISingleDepositParams } from '../../types/encodingTypes'
import { formatGasParams } from '../../utils/format'
import { multipleDepositInvariantHelper, singleDepositInvariantHelper } from '../../utils/invariantHelpers'

/**
 * Class to create the calldata to pass as argument for a given call to the branch router.
 */
export abstract class BranchBridgeAgent {
  public static readonly INTERFACE: Interface = new Interface(BranchBridgeAgentABI.abi)

  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   * Produces the on-chain calldata to pass as argument for a signed call (using the user's Virtual Account)
   * that does not require a token deposit.
   * Eg: Claiming rewards,withdraw, etc.
   * @param params The parameters to pass to the branch router function.
   */
  public static encodeCallOutSignedCalldata(params: string, gasParams: GasParams): string {
    return BranchBridgeAgent.INTERFACE.encodeFunctionData('callOutSigned', [params, formatGasParams(gasParams)])
  }

  /**
   * Produces the on-chain calldata to pass as argument for a signed call (using the user's Virtual Account) that requires a token deposit.
   *
   * @param account user account that's used for the refund of gas if applicable
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit token and amount.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @param hasFallbackToggled defaults to true.
   * @returns
   */
  public static encodeCallOutSignedAndBridgeCalldata({
    params,
    depositParams,
    gasParams,
    hasFallbackToggled = true,
  }: ICallOutSignedAndBridgeParams): string {
    //performs safety checks
    singleDepositInvariantHelper(depositParams)

    return BranchBridgeAgent.INTERFACE.encodeFunctionData('callOutSignedAndBridge', [
      params,
      [depositParams.hToken, depositParams.token, depositParams.amount, depositParams.deposit],
      formatGasParams(gasParams),
      hasFallbackToggled,
    ])
  }

  /**
   * Produces the on-chain calldata to pass as argument for a signed call (using the user's Virtual Account)
   * that requires multiple token deposits.
   * @param params The encoded params to pass to the root router. (executeSignedDepositSingle function on the router)
   * @param depositParams params that hold information about the deposit tokens and amounts.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @param hasFallbackToggled defaults to true
   * @returns
   */
  public static encodeCallOutSignedAndBridgeMultipleCalldata({
    params,
    depositParams,
    gasParams,
    hasFallbackToggled = true,
  }: ICallOutSignedAndBridgeMultipleParams): string {
    //performs safety checks
    multipleDepositInvariantHelper(depositParams)

    return BranchBridgeAgent.INTERFACE.encodeFunctionData('callOutSignedAndBridgeMultiple', [
      params,
      [depositParams.hTokens, depositParams.tokens, depositParams.amounts, depositParams.deposits],
      formatGasParams(gasParams),
      hasFallbackToggled,
    ])
  }

  /**
   * Used to retry a failed signed deposit on the branch chain.
   * @param depositNonce The nonce of the deposit to retry.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns encoded calldata for the retryDeposit function
   */
  public static encodeRetryDepositSigned({
    depositNonce,
    params,
    gasParams,
    hasFallbackToggled = true,
  }: IRetryDepositSignedParams): string {
    return BranchBridgeAgent.INTERFACE.encodeFunctionData('retryDepositSigned', [
      toHex(depositNonce),
      params,
      formatGasParams(gasParams),
      hasFallbackToggled,
    ])
  }

  /**
   * Used to retry a failed settlement.
   * @param settlementNonce The nonce of the settlement to retry.
   * @param params The encoded params to pass to the destination branch router.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @param hasFallbackToggled defaults to true
   * @returns encoded calldata for the retrySettlement function
   */
  public static encodeRetrySettlement({
    settlementNonce,
    params,
    gasParams,
    hasFallbackToggled = true,
  }: IRetrySettlementParams): string {
    return BranchBridgeAgent.INTERFACE.encodeFunctionData('retrySettlement', [
      toHex(settlementNonce),
      params,
      formatGasParams(gasParams),
      hasFallbackToggled,
    ])
  }

  /**
   * Used to request tokens back to the branch chain after an call fails.
   * @param depositNonce The nonce of the deposit to retrieve.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas
   * @returns encoded calldata for the retrieveDeposit function
   */
  public static encodeRetrieveDeposit({ depositNonce, gasParams }: IRetrieveDepositParams): string {
    return BranchBridgeAgent.INTERFACE.encodeFunctionData('retrieveDeposit', [
      toHex(depositNonce),
      formatGasParams(gasParams),
    ])
  }

  /**
   * Used to transfer tokens from the branch port to the owner of the deposit after an call fails.
   * @param depositNonce The nonce of the deposit to retrieve.
   * @param account user account that's used for receive the redeemed tokens.
   * @returns encoded calldata for the redeemDeposit function
   */
  public static encodeRedeemDeposit({ depositNonce, account }: IRedeemDepositParams): string {
    return BranchBridgeAgent.INTERFACE.encodeFunctionData('redeemDeposit(uint32,address)', [
      toHex(depositNonce),
      account,
    ])
  }

  /**
   * Used to transfer one of the deposited tokens from the branch port to the owner of the deposit after an call fails.
   * @param depositNonce The nonce of the deposit to retrieve.
   * @param account user account that's used for receive the redeemed tokens.
   * @param localToken local token address to redeem
   * @returns encoded calldata for the redeemDeposit function
   */
  public static encodeRedeemDepositSingle({ depositNonce, account, localToken }: IRedeemDepositSingleParams): string {
    return BranchBridgeAgent.INTERFACE.encodeFunctionData('redeemDeposit(uint32,address,address)', [
      toHex(depositNonce),
      account,
      localToken,
    ])
  }

  /**
   * Creates the calldata to pass as argument to a BranchBridgeAgent during a signed call (using the user's Virtual Account) to a MulticallRootRouterLibZip.
   * Produces the on-chain calldata to pass as argument for a call that does not require a token deposit.
   * Eg: Claiming rewards,withdraw liq, etc.
   *
   * @param params The parameters to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns the encoded calldata and message value for the call
   *
   */
  public static encodeCallOutSignedLibZipCalldata(params: string, gasParams: GasParams): MethodReturnParams {
    // Save first hex byte of the params
    const firstByte = params.slice(0, 4)

    // Compress remote Multicall Root Router Parameters using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [firstByte, LibZip.cdCompress(params.slice(4))])

    // Encode the function data.
    const encodedParams = this.encodeCallOutSignedCalldata(libZipEncodedParams, gasParams)

    return { calldata: encodedParams, value: toHex(0) }
  }

  /**
   * Creates the calldata to pass as argument to a BranchBridgeAgent during a signed call (using the user's Virtual Account) to a MulticallRootRouterLibZip.
   * Produces the on chain parameters to pass as arguments for a given call that requires a single token deposit.
   * Eg: ERC4626 Deposit, swap, etc.
   *
   * @param params parameters to pass to the branch router function.
   * @param dParams deposit params to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns the encoded calldata and message value for the call
   */
  public static encodeCallOutSignedAndBridgeLibZipCalldata(
    params: string,
    dParams: ISingleDepositParams,
    gasParams: GasParams,
    hasFallbackToggled = true
  ): MethodReturnParams {
    // Save first hex byte of the params
    const firstByte = params.slice(0, 4)

    // Compress remote Multicall Root Router Parameters using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [firstByte, LibZip.cdCompress(params.slice(4))])

    // Encode Branch Router function data.
    const encodedParams = this.encodeCallOutSignedAndBridgeCalldata({
      params: libZipEncodedParams,
      depositParams: dParams,
      gasParams,
      hasFallbackToggled,
    })

    return { calldata: encodedParams, value: toHex(0) }
  }

  /**
   * Creates the calldata to pass as argument to a BranchBridgeAgent during a signed call (using the user's Virtual Account) to a MulticallRootRouterLibZip.
   * Produces the on chain parameters to pass as arguments for a given call that requires multiple token deposit.
   * Eg: Adding Liquidity, etc.
   *
   * @param params parameters to pass to the branch router function.
   * @param mdParams multiple deposit params to pass to the branch router function.
   * @param gasParams params that hold information about the gasLimit and remoteBranchExecutionGas.
   * @returns the encoded calldata and message value for the call
   */
  public static encodeCallOutSignedAndBridgeMultipleLibZipCalldata(
    params: string,
    mdParams: IMultipleDepositParams,
    gasParams: GasParams,
    hasFallbackToggled = true
  ): MethodReturnParams {
    // Save first hex byte of the params
    const firstByte = params.slice(0, 4)

    // Compress remote Multicall Root Router Parameters using libZip.
    const libZipEncodedParams = pack(['bytes1', 'bytes'], [firstByte, LibZip.cdCompress(params.slice(4))])

    // Encode function data with params & mdParams.
    const encodedParams = this.encodeCallOutSignedAndBridgeMultipleCalldata({
      params: libZipEncodedParams,
      depositParams: mdParams,
      gasParams,
      hasFallbackToggled,
    })

    return {
      calldata: encodedParams,
      value: toHex(0),
    }
  }
}
