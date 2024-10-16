import { Interface } from '@ethersproject/abi'
import JSBI from 'jsbi'
import { ZERO } from 'maia-core-sdk'
import { LibZip } from 'solady'
import invariant from 'tiny-invariant'

import VirtualAccountABI from '../../abis/VirtualAccount.json'
import { IMulticallCall, IPayableCall } from '../../types/encodingTypes'
import { IWithdrawERC20Params, IWithdrawNativeParams } from '../../types/virtualAccountTypes'
import { formatCalls, formatPayableCalls } from '../../utils/format'
import { virtualAccountCallInvariantHelper, virtualAccountWithdrawInvariantHelper } from '../../utils/invariantHelpers'

/**
 * Represents a virtual account and helps to interact with it.
 */
export abstract class VirtualAccount {
  public static readonly INTERFACE: Interface = new Interface(VirtualAccountABI.abi)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Aggregate calls ensuring each call is successful
   * @param calls list of calls to aggregate
   */
  public static encodeMulticall(calls: IMulticallCall[]) {
    //performs safety check before encoding the data
    virtualAccountCallInvariantHelper(calls)

    return VirtualAccount.INTERFACE.encodeFunctionData('call', [formatCalls(calls)])
  }

  /**
   * Aggregate calls with a msg value (gas value) ensuring each call is successful
   * @param calls list of payable calls to aggregate
   */
  public static encodePayableCall(calls: IPayableCall[]) {
    virtualAccountCallInvariantHelper(calls)

    return VirtualAccount.INTERFACE.encodeFunctionData('payableCall', [formatPayableCalls(calls)])
  }

  /**
   * Aggregate calls ensuring each call is successful
   * @param calls list of calls to aggregate
   */
  public static encodeMulticallWithCompression(calls: IMulticallCall[]) {
    //performs safety check before encoding the data
    virtualAccountCallInvariantHelper(calls)

    const calldata = VirtualAccount.INTERFACE.encodeFunctionData('call', [formatCalls(calls)])

    return LibZip.cdCompress(calldata)
  }

  /**
   * Aggregate calls with a msg value (gas value) ensuring each call is successful
   * @param calls list of payable calls to aggregate
   */
  public static encodePayableCallWithCompression(calls: IPayableCall[]) {
    virtualAccountCallInvariantHelper(calls)

    const calldata = VirtualAccount.INTERFACE.encodeFunctionData('payableCall', [formatPayableCalls(calls)])

    return LibZip.cdCompress(calldata)
  }

  /**
   * Withdraws native tokens from the VirtualAccount
   * @param params number corresponding to amount of native tokens to withdraw
   */
  public static encodeWithdrawNative(params: IWithdrawNativeParams) {
    invariant(JSBI.BigInt(params.amount) >= ZERO, 'Amount must be greater than or equal to 0')
    return VirtualAccount.INTERFACE.encodeFunctionData('withdrawNative', [params.amount])
  }

  /**
   * Withdraws ERC20 tokens from the VirtualAccount
   * @param params IWithdrawERC20Params{ token: string, amount: number } - token address and amonunt to withdraw.
   */
  public static encodeWithdrawERC20(params: IWithdrawERC20Params) {
    virtualAccountWithdrawInvariantHelper(params.token, JSBI.BigInt(params.amount))
    return VirtualAccount.INTERFACE.encodeFunctionData('withdrawERC20', [params.token, params.amount])
  }

  /**
   * Withdraws ERC721 tokens from the VirtualAccount
   * @param token token address to withdraw
   * @param tokenId tokenId to withdraw
   */
  public static encodeWithdrawERC721(token: string, tokenId: number) {
    virtualAccountWithdrawInvariantHelper(token, undefined, JSBI.BigInt(tokenId))
    return VirtualAccount.INTERFACE.encodeFunctionData('withdrawERC721', [token, tokenId])
  }
}
