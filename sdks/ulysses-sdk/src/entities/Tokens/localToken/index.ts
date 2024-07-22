import { Currency, SupportedChainId } from 'maia-core-sdk'

import { BaseVirtualizedToken, TokenType } from '../baseVirtualizedToken'
import { GlobalToken } from '../globalToken'

/**
 * These tokens reside on the branch chains of the ulysses system,
 * and represent a deposit of the global token on the branch chain.
 *
 * @export
 * @class LocalToken
 * @extends {BaseVirtualizedToken}
 */
export class LocalToken extends BaseVirtualizedToken {
  /**
   * Sets the token type to LOCAL
   * @type {TokenType}
   * @memberof LocalToken
   */
  public readonly tokenType: TokenType = TokenType.LOCAL

  public readonly globalToken: GlobalToken

  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    underlyingCurrency: Currency,
    globalToken: GlobalToken,
    symbol?: string,
    name?: string
  ) {
    super(address, chainId, decimals, underlyingCurrency, symbol, name)
    this.globalToken = globalToken
  }

  /**
   * Gets the token address of the hToken for a given chain.
   * @param chainId chainId to get the hToken balance from
   * @returns
   */
  public getChainTokenAddress(chainId: SupportedChainId) {
    return this.globalToken.hTokensPerChain?.get(chainId)
  }
}
