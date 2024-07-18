import { Interface } from '@ethersproject/abi'
import ISelfPermit from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISelfPermit.sol/ISelfPermit.json'
import { NativeToken, toHex } from 'maia-core-sdk'

import { AllowedPermitArguments, PermitOptions } from '../../types/self-permit'

function isAllowedPermit(permitOptions: PermitOptions): permitOptions is AllowedPermitArguments {
  return 'nonce' in permitOptions
}

export abstract class SelfPermit {
  public static readonly INTERFACE: Interface = new Interface(ISelfPermit.abi)

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodePermit(token: NativeToken, options: PermitOptions) {
    return isAllowedPermit(options)
      ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [
          token.address,
          toHex(options.nonce),
          toHex(options.expiry),
          options.v,
          options.r,
          options.s,
        ])
      : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [
          token.address,
          toHex(options.amount),
          toHex(options.deadline),
          options.v,
          options.r,
          options.s,
        ])
  }
}
