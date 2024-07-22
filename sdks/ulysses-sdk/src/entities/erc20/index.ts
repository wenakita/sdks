import { Interface } from '@ethersproject/abi'
import { BigintIsh } from 'maia-core-sdk'

import ERC20 from '../../abis/ERC20.json'

/**
 * Class to handle ERC20 specific contract functions.
 */
export abstract class ERC20Token {
  public static readonly INTERFACE: Interface = new Interface(ERC20.abi)

  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  public static encodeApproveToken(amount: BigintIsh, spender: string) {
    return ERC20Token.INTERFACE.encodeFunctionData('approve', [spender, amount.toString()])
  }
  public static encodeTransfer(amount: BigintIsh, recipient: string) {
    return ERC20Token.INTERFACE.encodeFunctionData('transfer', [recipient, amount.toString()])
  }
}
