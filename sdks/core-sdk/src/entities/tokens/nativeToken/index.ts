import invariant from 'tiny-invariant'

import { checkValidAddress, validateAndParseAddress } from '../../../utils/addresses/validateAndParseAddress'
import type { Currency } from '../../tokens/currency'
import { BaseCurrency } from '../baseCurrency'

/**
 * Represents an ERC20 token with a unique address and some metadata native to a given chain.
 */
export class NativeToken extends BaseCurrency {
  public readonly isNative: false = false as const
  public readonly isToken: true = true as const

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string

  /**
   *
   * @param chainId {@link BaseCurrency#chainId}
   * @param address The contract address on the chain on which this token lives
   * @param decimals {@link BaseCurrency#decimals}
   * @param symbol {@link BaseCurrency#symbol}
   * @param name {@link BaseCurrency#name}
   * @param bypassChecksum If true it only checks for length === 42, startsWith 0x and contains only hex characters
   */
  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    bypassChecksum?: boolean
  ) {
    super(chainId, decimals, symbol, name)
    if (bypassChecksum) {
      this.address = checkValidAddress(address)
    } else {
      this.address = validateAndParseAddress(address)
    }
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return other.isToken && this.chainId === other.chainId && this.address.toLowerCase() === other.address.toLowerCase()
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: NativeToken): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address.toLowerCase() !== other.address.toLowerCase(), 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): this {
    return this
  }
}
