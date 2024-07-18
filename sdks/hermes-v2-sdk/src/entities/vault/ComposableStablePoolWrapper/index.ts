import JSBI from 'jsbi'
import { CurrencyAmount, NativeToken, ONE_18, Price } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { FullMath } from '../../../utils/fullMath'
import { Vault } from '..'

/**
 * Represents an ERC4626 ComposableStablePoolWrapper
 */
export class ComposableStablePoolWrapper extends Vault {
  // The exchange rate of the underlying token to the vault token
  public readonly rate: JSBI

  private _token0Price?: Price<NativeToken, NativeToken>
  private _token1Price?: Price<NativeToken, NativeToken>

  /**
   * Returns the price of the vault token in terms of the underlying token
   * @param underlying One of the tokens in the vault, the underlying token
   * @param vault The other token in the vault, the vault's address
   * @param rate The exchange rate of the underlying token to the vault token
   * @returns The price of the vault token in terms of the underlying token
   */
  public static priceOfVault(underlying: NativeToken, vault: NativeToken, rate: JSBI): Price<NativeToken, NativeToken> {
    return new Price(vault, underlying, rate, ONE_18)
  }

  /**
   * Returns the price of the underlying token in terms of the vault token
   * @param underlying One of the tokens in the vault, the underlying token
   * @param vault The other token in the vault, the vault's address
   * @param rate The exchange rate of the underlying token to the vault token
   * @returns The price of the underlying token in terms of the vault token
   */
  public static priceOfUnderlying(
    underlying: NativeToken,
    vault: NativeToken,
    rate: JSBI
  ): Price<NativeToken, NativeToken> {
    return new Price(underlying, vault, ONE_18, rate)
  }

  /**
   * Construct a vault
   * @param underlying One of the tokens in the vault, the underlying token
   * @param vault The other token in the vault, the vault's address
   * @param rate The exchange rate of the underlying token to the vault token
   */
  public constructor(underlying: NativeToken, vault: NativeToken, rate: JSBI) {
    super(underlying, vault)
    this.rate = rate
  }

  /**
   * Returns the current mid price of the vault in terms of token0, i.e. the ratio of token1 over token0
   */
  public get token0Price(): Price<NativeToken, NativeToken> {
    return (
      this._token0Price ??
      (this._token0Price = this.vaultIsToken0
        ? ComposableStablePoolWrapper.priceOfVault(this.token1, this.token0, this.rate)
        : ComposableStablePoolWrapper.priceOfUnderlying(this.token0, this.token1, this.rate))
    )
  }

  /**
   * Returns the current mid price of the vault in terms of token1, i.e. the ratio of token0 over token1
   */
  public get token1Price(): Price<NativeToken, NativeToken> {
    return (
      this._token1Price ??
      (this._token1Price = this.vaultIsToken0
        ? ComposableStablePoolWrapper.priceOfUnderlying(this.token1, this.token0, this.rate)
        : ComposableStablePoolWrapper.priceOfVault(this.token0, this.token1, this.rate))
    )
  }

  /**
   * Given an input amount of a token, return the computed output amount, and a vault with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param rate The exchange rate of the underlying token to the vault token
   * @returns The output amount and the vault with updated state
   * @NOTE Call this when calculating "deposit" and "redeem" amounts
   */
  public async getOutputAmount(
    inputAmount: CurrencyAmount<NativeToken>,
    rate?: JSBI
  ): Promise<[CurrencyAmount<NativeToken>, ComposableStablePoolWrapper]> {
    return this.getAmount(inputAmount, rate, true)
  }

  /**
   * Given a desired output amount of a token, return the computed input amount and a vault with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param rate The exchange rate of the underlying token to the vault token
   * @returns The input amount and the vault with updated state
   * @NOTE Call this when calculating "mint" and "withdraw" amounts
   */
  public async getInputAmount(
    outputAmount: CurrencyAmount<NativeToken>,
    rate?: JSBI
  ): Promise<[CurrencyAmount<NativeToken>, ComposableStablePoolWrapper]> {
    return this.getAmount(outputAmount, rate, false)
  }

  /**
   * Given an amount of a token, return the computed amount of the other token and a vault with state updated after the trade
   * @param amount The amount for which to quote the other amount
   * @param rate The exchange rate of the underlying token to the vault token
   * @param roundDown Whether to round down or not
   * @returns The other amount and the vault with updated state
   */
  private async getAmount(
    amount: CurrencyAmount<NativeToken>,
    rate: JSBI | undefined,
    roundDown: boolean
  ): Promise<[CurrencyAmount<NativeToken>, ComposableStablePoolWrapper]> {
    invariant(this.involvesToken(amount.currency), 'TOKEN')

    if (!rate) rate = this.rate

    const otherAmounnt = ComposableStablePoolWrapper.getOtherAmount(
      amount,
      this.underlying(),
      this.vault(),
      rate,
      roundDown
    )

    return [otherAmounnt, new ComposableStablePoolWrapper(this.underlying(), this.vault(), this.rate)]
  }

  /**
   * Returns the price of the underlying token in terms of the vault token
   * @param amount
   * @param underlying
   * @param vault
   * @param rate
   * @returns
   */
  private static getOtherAmount(
    amount: CurrencyAmount<NativeToken>,
    underlying: NativeToken,
    vault: NativeToken,
    rate: JSBI,
    roundDown: boolean
  ): CurrencyAmount<NativeToken> {
    // Check if the currency of the amount is the same as the vault
    const tokenIsVault = amount.currency.equals(vault)

    // Decide the operation based on whether the token is the vault or not
    let resultAmount: JSBI
    if (roundDown) {
      resultAmount = tokenIsVault
        ? FullMath.divDownFixed(amount.quotient, rate)
        : FullMath.mulDownFixed(amount.quotient, rate)
    } else {
      resultAmount = tokenIsVault
        ? FullMath.divUpFixed(amount.quotient, rate)
        : FullMath.mulUpFixed(amount.quotient, rate)
    }

    // Return the new CurrencyAmount with the underlying or vault currency and calculated numerator and denominator
    return CurrencyAmount.fromRawAmount(tokenIsVault ? underlying : vault, resultAmount)
  }
}
