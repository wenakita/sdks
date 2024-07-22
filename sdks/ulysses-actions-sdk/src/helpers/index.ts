import { BigintIsh, toHex, ZERO } from 'maia-core-sdk'
import { ERC20Token, GasParams, IMultipleDepositParams, ISingleDepositParams, ITokenOutputParams } from 'ulysses-sdk'

import { IActionResult, IContextParameters } from '../utils'

// TODO: MOVE THIS TO ULYSSES-SDK
export type ITokenInputParams = ISingleDepositParams | IMultipleDepositParams

/**
 * Returns the action context
 * @param chainId chain id
 * @param useVirtualAccount flag to use virtual account
 * @param userAccount user account
 * @param value message value
 * @param gasParams cross-chain gas parameters
 * @returns the action context for use in transaction builder
 */
export function getActionContext(
  chainId: number,
  useVirtualAccount: boolean,
  userAccount?: string,
  value?: string,
  gasParams?: GasParams,
  inputTokens?: ITokenInputParams,
  outputTokens?: ITokenOutputParams
): IContextParameters {
  return {
    chainId,
    useVirtualAccount,
    userAccount,
    value,
    gasParams,
    inputTokens,
    outputTokens,
  }
}

/**
 * Creates the token input parameters
 * @param hTokens the hTokens
 * @param tokens the tokens
 * @param amounts the amounts
 * @param deposits the deposits
 * @returns the token input parameters
 */
export function createTokenInputParams(
  hTokens: string[],
  tokens: string[],
  amounts: BigintIsh[],
  deposits: BigintIsh[]
): ITokenInputParams {
  if (hTokens.length > 1) {
    return {
      hTokens,
      tokens,
      amounts: amounts.map((amount) => amount.toString()),
      deposits: deposits.map((deposit) => deposit.toString()),
    }
  } else {
    return {
      hToken: hTokens[0],
      token: tokens[0],
      amount: amounts[0].toString(),
      deposit: deposits[0].toString(),
    }
  }
}

/**
 * Creates the token output parameters
 * @param settlementOwner the settlement owner
 * @param recipient the recipient in the destination chain
 * @param dstChainId the destination chain id
 * @param gasParams the gas parameters
 * @param outputTokens the output tokens
 * @param amountsOut the amounts out
 * @param depositsOut the deposits out
 * @returns
 */
export function createTokenOutputParams(
  settlementOwner: string,
  recipient: string,
  dstChainId: number,
  gasParams: GasParams,
  outputTokens: string[],
  amountsOut: BigintIsh[],
  depositsOut: BigintIsh[]
): ITokenOutputParams {
  if (outputTokens?.length > 1) {
    return {
      settlementOwner,
      recipient,
      outputTokens,
      amountsOut: amountsOut.map((amount) => amount.toString()),
      depositsOut: depositsOut.map((deposit) => deposit.toString()),
      dstChainId,
      gasParams,
    }
  } else {
    return {
      settlementOwner,
      recipient,
      outputToken: outputTokens[0] ?? '',
      amountOut: amountsOut[0].toString() || ZERO.toString(),
      depositOut: depositsOut[0].toString() || ZERO.toString(),
      dstChainId,
      gasParams,
    }
  }
}

export interface ITransferOrApproveParams {
  approvalFlags: boolean[]
  tokensToSpend: string[]
  amountsToSpend: BigintIsh[]
  spenders: string[]
}

/**
 * Generates the approvals calldata - e.g. useful to get calldata to send for Virtual Account execution.
 * @param params the approval parameters
 * @returns the approvals calldata
 */
export function generateTransferOrApproveCalldata(params: ITransferOrApproveParams): IActionResult<unknown>[] {
  const { approvalFlags, tokensToSpend, amountsToSpend, spenders } = params

  return tokensToSpend.map((token, index) => {
    return {
      target: token,
      params: {
        calldata: approvalFlags[index]
          ? ERC20Token.encodeApproveToken(amountsToSpend[index], spenders[index])
          : ERC20Token.encodeTransfer(amountsToSpend[index], spenders[index]),
        value: toHex('0'),
      },
    }
  })
}

export function returnDefaultParams(
  targets: string[],
  calldatas: string[],
  values: string[] | undefined
): IActionResult<unknown>[] {
  return targets.map((target, index) => {
    return {
      target,
      params: { calldata: calldatas[index], value: values?.[index] ? values[index] : toHex('0') },
    } as IActionResult<unknown>
  })
}
