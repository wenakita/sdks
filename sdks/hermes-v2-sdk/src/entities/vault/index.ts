import { BalancerAddresses, CurrencyAmount, NativeToken, Percent, Price, SupportedChainId } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { computeVaultAddress } from '../../utils/addresses/computeVaultAddress'

/**
 * Represents an ERC4626 vault
 */
export abstract class Vault {
  // One of these tokens is the Vault's address and the other is the underlying token
  public readonly token0: NativeToken
  public readonly token1: NativeToken
  public readonly vaultIsToken0: boolean
  public readonly fee: Percent // Default fee is 0

  // Only one token used to get Address since the other is the Vault's address
  public static getAddress(
    underlying: NativeToken,
    initCodeHashManualOverride?: string,
    factoryAddressOverride?: string
  ): string {
    return computeVaultAddress({
      factoryAddress:
        factoryAddressOverride ??
        BalancerAddresses[underlying.chainId as SupportedChainId]!.ComposableStablePoolWrapperFactory,
      underlying: underlying.address,
      initCodeHash:
        initCodeHashManualOverride ??
        BalancerAddresses[underlying.chainId as SupportedChainId]!.ComposableStablePoolWrapperInitCodeHash,
    })
  }

  /**
   * Construct a vault
   * @param underlying One of the tokens in the vault, the underlying token
   * @param vault The other token in the vault, the vault's address
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the vault
   */
  public constructor(
    underlying: NativeToken,
    vault: NativeToken,
    fee?: Percent // Default fee is 0
  ) {
    ;[this.token0, this.token1] = underlying.sortsBefore(vault) ? [underlying, vault] : [vault, underlying]
    this.fee = fee ?? new Percent(0)
    this.vaultIsToken0 = this.token0.equals(vault)
  }

  /**
   * Returns the vault token
   * @returns The vault token
   */
  public vault(): NativeToken {
    return this.vaultIsToken0 ? this.token0 : this.token1
  }

  /**
   * Returns the underlying token
   * @returns The underlying token
   */
  public underlying(): NativeToken {
    return this.vaultIsToken0 ? this.token1 : this.token0
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  public involvesToken(token: NativeToken): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the vault in terms of token0, i.e. the ratio of token1 over token0
   */
  public abstract get token0Price(): Price<NativeToken, NativeToken>

  /**
   * Returns the current mid price of the vault in terms of token1, i.e. the ratio of token0 over token1
   */
  public abstract get token1Price(): Price<NativeToken, NativeToken>

  /**
   * Return the price of the given token in terms of the other token in the vault.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  public priceOf(token: NativeToken): Price<NativeToken, NativeToken> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the vault.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  /**
   * Given an input amount of a token, return the computed output amount, and a vault with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @returns The output amount and the vault with updated state
   * @NOTE Call this when calculating "deposit" and "redeem" amounts
   */
  public abstract getOutputAmount(
    inputAmount: CurrencyAmount<NativeToken>
  ): Promise<[CurrencyAmount<NativeToken>, Vault]>

  /**
   * Given a desired output amount of a token, return the computed input amount and a vault with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @returns The input amount and the vault with updated state
   * @NOTE Call this when calculating "mint" and "withdraw" amounts
   */
  public abstract getInputAmount(
    outputAmount: CurrencyAmount<NativeToken>
  ): Promise<[CurrencyAmount<NativeToken>, Vault]>
}
