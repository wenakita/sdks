import { Interface } from '@ethersproject/abi'
import IPeripheryPaymentsWithFee from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IPeripheryPaymentsWithFee.sol/IPeripheryPaymentsWithFee.json'
import JSBI from 'jsbi'
import { NativeToken, Percent, toHex } from 'maia-core-sdk'

import { FeeOptions } from '../../types/payment'
import { validateAndParseAddress } from '../../utils/addresses/validateAndParseAddress'

export abstract class Payments {
  public static readonly INTERFACE: Interface = new Interface(IPeripheryPaymentsWithFee.abi)

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  private static encodeFeeBips(fee: Percent): string {
    return toHex(fee.multiply(10_000).quotient)
  }

  public static encodeUnwrapWETH9(amountMinimum: JSBI, recipient: string, feeOptions?: FeeOptions): string {
    recipient = validateAndParseAddress(recipient)

    if (!!feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient: string = validateAndParseAddress(feeOptions.recipient)

      return Payments.INTERFACE.encodeFunctionData('unwrapWETH9WithFee', [
        toHex(amountMinimum),
        recipient,
        feeBips,
        feeRecipient,
      ])
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWETH9', [toHex(amountMinimum), recipient])
    }
  }

  public static encodeSweepToken(
    token: NativeToken,
    amountMinimum: JSBI,
    recipient: string,
    feeOptions?: FeeOptions
  ): string {
    recipient = validateAndParseAddress(recipient)

    if (!!feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient: string = validateAndParseAddress(feeOptions.recipient)

      return Payments.INTERFACE.encodeFunctionData('sweepTokenWithFee', [
        token.address,
        toHex(amountMinimum),
        recipient,
        feeBips,
        feeRecipient,
      ])
    } else {
      return Payments.INTERFACE.encodeFunctionData('sweepToken', [token.address, toHex(amountMinimum), recipient])
    }
  }

  public static encodeRefundETH(): string {
    return Payments.INTERFACE.encodeFunctionData('refundETH')
  }
}
