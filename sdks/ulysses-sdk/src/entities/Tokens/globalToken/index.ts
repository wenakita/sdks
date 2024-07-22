import { Currency, SupportedChainId } from 'maia-core-sdk'

import { BaseVirtualizedToken, TokenType } from '../baseVirtualizedToken'

/**
 * Represents the token that is virtualized in Arbitrum.
 * This is a representation of the Global Token of the Ulysses system that resides on Arbitrum and is virtualized in other chains via Local Tokens.
 * These tokens can be accessed through the user EOA if he's on Arbitrum, or indirectly through the Virtual Account belonging to the user.
 */
export class GlobalToken extends BaseVirtualizedToken {
  /**
   * Sets the type of the token.
   */
  public readonly tokenType?: TokenType = TokenType.GLOBAL

  /**
   * Holds the mapping of chainId => local hToken address
   * Represents in which chains the token is virtualized in, aka the hTokens addresses for each present chain.
   *
   * Eg: 1inch has a native address on mainnet (address), and a globalAddress(1inch from mainnet virtualized in Arbitrum)
   * if the token is also virtualized in Metis & BSC then the mapping will be:
   * hTokensPerChain:{ 1088: 'metislocalhTokenAddress', 56: 'bsclocalhTokenAddress' }
   *
   * @type {Map<SupportedChainId, string>}
   * @memberof GlobalToken
   */
  public readonly hTokensPerChain?: Map<SupportedChainId, string>

  constructor(
    chainId: number,
    address: string,
    decimals: number,
    underlyingCurrency: Currency,
    symbol?: string,
    name?: string,
    hTokensPerChain?: Map<SupportedChainId, string>
  ) {
    super(address, chainId, decimals, underlyingCurrency, symbol, name)
    this.hTokensPerChain = hTokensPerChain ?? new Map<SupportedChainId, string>()
  }

  /**
   * Gets the token address of the hToken for a given chain.
   * @param chainId chainId to get the hToken balance from
   * @returns
   */
  public getChainTokenAddress(chainId: SupportedChainId) {
    return this.hTokensPerChain?.get(chainId)
  }
}
