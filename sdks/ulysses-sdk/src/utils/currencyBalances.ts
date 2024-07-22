import { Currency, CurrencyAmount } from 'maia-core-sdk'

export interface ICurrencyBalances {
  native: CurrencyAmount<Currency> | undefined
  global: CurrencyAmount<Currency> | undefined
  hToken: CurrencyAmount<Currency> | undefined
  virtual: {
    native: CurrencyAmount<Currency> | undefined
    global: CurrencyAmount<Currency> | undefined
  }
}

/**
 * Represents the balances of a user across all currencies on the chain
 */
export class CurrencyBalances {
  public readonly token: Currency
  public readonly currencyBalances: ICurrencyBalances

  private _totalBalance?: CurrencyAmount<Currency>
  private _rootBalance?: CurrencyAmount<Currency>

  /**
   * @param Currency The global token of the chain
   * @param currencyBalances The balances of the user
   * @param currencyBalances.native The native balance of the user
   * @param currencyBalances.global The global balance of the user
   * @param currencyBalances.hToken The hToken balance of the user
   * @param currencyBalances.virtual The virtual balance of the user
   * @param currencyBalances.virtual.native The virtual native balance of the user
   * @param currencyBalances.virtual.global The virtual global balance of the user
   * @returns The currency balances of the user
   * @example
   * ```ts
   * const currencyBalances = new CurrencyBalances(Currency, {
   *  native: CurrencyAmount.fromRawAmount(Currency.wrapped, 100),
   *  global: CurrencyAmount.fromRawAmount(Currency, 100),
   *  hToken: CurrencyAmount.fromRawAmount(hToken, 100),
   *  virtual: {
   *    native: CurrencyAmount.fromRawAmount(Currency.wrapped, 100),
   *    global: CurrencyAmount.fromRawAmount(Currency, 100),
   *  },
   * })
   * ```
   */
  public constructor(token: Currency, currencyBalances: ICurrencyBalances) {
    this.token = token
    this.currencyBalances = currencyBalances
  }

  /**
   * Returns the total sum of balances of the user, including the balance from the virtual account.
   * @returns The total spendable balance of the user.
   */
  public getTotalBalance(): CurrencyAmount<Currency> {
    return (
      this._totalBalance ??
      (this._totalBalance = CurrencyAmount.fromRawAmount(
        this.token,
        this.getNativeBalance()
          .asFraction.add(this.getGlobalBalance().asFraction)
          .add(this.getHTokenBalance().asFraction)
          .add(this.getVirtualNativeBalance().asFraction.add(this.getVirtualGlobalBalance().asFraction)).quotient
      ))
    )
  }

  /**
   * Returns the total sum of balances of the user, spendable from a chain.
   * @param isRootChain Whether the chain is the root chain or not.
   * @dev If isRootChain is not provided, it defaults to false.
   * @returns The total spendable balance of the user from the chain.
   */
  public getBalance(isRootChain?: boolean) {
    return isRootChain ? this.getRootBalance() : this.getRemoteBalance()
  }

  /**
   * Returns the total sum of balances of the user, spendable from a remote chain.
   * @returns The total spendable balance of the user from the remote chain.
   */
  public getRemoteBalance(): CurrencyAmount<Currency> {
    return (
      this._totalBalance ??
      (this._totalBalance = CurrencyAmount.fromRawAmount(
        this.token,
        this.getNativeBalance()
          .asFraction.add(this.getHTokenBalance().asFraction)
          .add(this.getVirtualNativeBalance().asFraction.add(this.getVirtualGlobalBalance().asFraction)).quotient
      ))
    )
  }

  /**
   * Returns the total sum of balances of the user, spendable from the root chain.
   * @returns The total spendable balance of the user from the root chain.
   */
  public getRootBalance(): CurrencyAmount<Currency> {
    return (
      this._rootBalance ??
      (this._rootBalance = CurrencyAmount.fromRawAmount(
        this.token,
        this.getNativeBalance()
          .asFraction.add(this.getGlobalBalance().asFraction)
          .add(this.getVirtualNativeBalance().asFraction.add(this.getVirtualGlobalBalance().asFraction)).quotient
      ))
    )
  }

  public getNativeBalance(): CurrencyAmount<Currency> {
    return this.parseCurrencyAmount(this.currencyBalances.native)
  }

  /**
   * Returns the combined native balance of the user, including the balance from the virtual account.
   * @returns
   */
  public getCombinedNativeBalance(): {
    native: CurrencyAmount<Currency>
    virtual: CurrencyAmount<Currency>
    total: CurrencyAmount<Currency>
  } {
    const native = this.parseCurrencyAmount(this.currencyBalances.native)
    const virtual = this.parseCurrencyAmount(this.currencyBalances.virtual.native)
    return {
      native,
      virtual,
      total: native.add(virtual),
    }
  }

  public getGlobalBalance() {
    return this.parseCurrencyAmount(this.currencyBalances.global)
  }

  public getCombinedGlobalBalance(): {
    global: CurrencyAmount<Currency>
    virtual: CurrencyAmount<Currency>
    total: CurrencyAmount<Currency>
  } {
    const global = this.parseCurrencyAmount(this.currencyBalances.global)
    const virtual = this.parseCurrencyAmount(this.currencyBalances.virtual.global)
    return {
      global,
      virtual,
      total: global.add(virtual),
    }
  }

  public getHTokenBalance(): CurrencyAmount<Currency> {
    return this.parseCurrencyAmount(this.currencyBalances.hToken)
  }

  public getVirtualBalance(): {
    virtual: {
      native: CurrencyAmount<Currency> | undefined
      global: CurrencyAmount<Currency> | undefined
    }
  } {
    return {
      virtual: {
        native: this.getVirtualNativeBalance(),
        global: this.getVirtualGlobalBalance(),
      },
    }
  }

  public getVirtualNativeBalance(): CurrencyAmount<Currency> {
    return this.parseCurrencyAmount(this.currencyBalances.virtual.native)
  }

  public getVirtualGlobalBalance(): CurrencyAmount<Currency> {
    return this.parseCurrencyAmount(this.currencyBalances.virtual.global)
  }

  private parseCurrencyAmount(amount: CurrencyAmount<Currency> | undefined) {
    return amount ?? CurrencyAmount.fromRawAmount(this.token.wrapped, 0)
  }
}
