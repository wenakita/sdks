import { CurrencyAmount, NativeToken, Price } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { ComposableStablePoolWrapper } from '../vault/ComposableStablePoolWrapper'
import { BalancerComposableStablePool } from './BalancerComposableStablePool'

export class ComposableStablePool {
  public readonly token0: NativeToken
  public readonly token1: NativeToken
  public readonly wrapper?: ComposableStablePoolWrapper
  public readonly wrappedTokenIndex: number // -1 = no wrapped tokens, 0 = token0 is wrapped, 1 = token1 is wrapped

  private _pool: BalancerComposableStablePool

  private _token0Price?: Price<NativeToken, NativeToken>
  private _token1Price?: Price<NativeToken, NativeToken>

  constructor(
    tokenA: NativeToken,
    tokenB: NativeToken,
    pool: BalancerComposableStablePool,
    wrapper?: ComposableStablePoolWrapper
  ) {
    ;[this.token0, this.token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    this._pool = pool
    this.wrapper = wrapper

    // If the wrapper is set, we can determine if the pool contains wrapped tokens
    if (!!this.wrapper) {
      if (this.wrapper.vault().equals(this.token0)) {
        this.wrappedTokenIndex = 0
      } else if (this.wrapper.vault().equals(this.token1)) {
        this.wrappedTokenIndex = 1
      } else {
        // If the wrapper is set, but the vault is not one of the tokens, throw an error
        throw Error('WRONG TOKENS')
      }
    } else {
      this.wrappedTokenIndex = -1
    }
  }

  public get pool(): BalancerComposableStablePool {
    return this._pool
  }

  public set pool(value: BalancerComposableStablePool) {
    this._pool = value
  }

  // Methods similar to Uniswap's Pool class but using Balancer logic

  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  public involvesToken(token: NativeToken): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  public get token0Price(): Price<NativeToken, NativeToken> {
    return this._token0Price ?? (this._token0Price = this.getTokenPrice(this.token0, this.token1))
  }

  /**
   * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
   */
  public get token1Price(): Price<NativeToken, NativeToken> {
    return this._token1Price ?? (this._token1Price = this.getTokenPrice(this.token1, this.token0))
  }

  private getTokenPrice(token: NativeToken, otherToken: NativeToken): Price<NativeToken, NativeToken> {
    // Case when neither of the tokens is wrapped.
    if (this.wrappedTokenIndex === -1) {
      return this.pool.priceOf(token, otherToken)
    }

    invariant(this.wrapper, 'WRAPPER NOT SET')
    const notWrappedToken = this.wrappedTokenIndex === 0 ? this.token1 : this.token0
    const bpt = this.wrapper.underlying()

    // If other token is the bpt, then use the wrapper's rate to calculate the price
    if (notWrappedToken.equals(bpt)) {
      return this.wrapper.priceOf(token)
    }

    const zeroForOtherToken = notWrappedToken.equals(token)

    // Get the price of the token in terms of the other token, using both the pool and the wrapper
    const poolPrice = this.pool.priceOf(zeroForOtherToken ? token : bpt, zeroForOtherToken ? bpt : otherToken)
    const wrapperPrice = this.wrapper.priceOf(zeroForOtherToken ? otherToken : token)

    const price = poolPrice
      .quote(CurrencyAmount.fromRawAmount(zeroForOtherToken ? token : bpt, '1'))
      .multiply(wrapperPrice)

    return new Price(token, otherToken, price.denominator, price.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  public priceOf(token: NativeToken): Price<NativeToken, NativeToken> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @returns The output amount and the pool with updated state
   * @throws if token is not in the pool
   */
  public async getOutputAmount(
    inputAmount: CurrencyAmount<NativeToken>
  ): Promise<[CurrencyAmount<NativeToken>, ComposableStablePool]> {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')

    const zeroForOne = inputAmount.currency.equals(this.token0)

    // Case when neither of the tokens is wrapped.
    if (this.wrappedTokenIndex === -1) {
      const [outputAmount, updatedPool]: [CurrencyAmount<NativeToken>, BalancerComposableStablePool] =
        await this.pool.getOutputAmount(inputAmount, zeroForOne ? this.token1 : this.token0)

      return [outputAmount, new ComposableStablePool(this.token0, this.token1, updatedPool)]
    }

    invariant(this.wrapper, 'WRAPPER NOT SET')

    const notWrappedToken = this.wrappedTokenIndex === 0 ? this.token1 : this.token0
    const bpt = this.wrapper.underlying()

    // If other token is the bpt, then use the wrapper's rate to calculate the output amount
    if (notWrappedToken.equals(bpt)) {
      const [outputAmount, updatedWrapper]: [CurrencyAmount<NativeToken>, ComposableStablePoolWrapper] =
        await this.wrapper.getOutputAmount(inputAmount)
      return [outputAmount, new ComposableStablePool(this.token0, this.token1, this.pool, updatedWrapper)]
    }

    // If the input token is wrapped, first unwrap then calculate the output amount
    if (notWrappedToken.equals(inputAmount.currency)) {
      const [unwrappedAmount, updatedWrapper]: [CurrencyAmount<NativeToken>, ComposableStablePoolWrapper] =
        await this.wrapper.getOutputAmount(inputAmount)
      const [outputAmount, updatedPool]: [CurrencyAmount<NativeToken>, BalancerComposableStablePool] =
        await this.pool.getOutputAmount(unwrappedAmount, zeroForOne ? this.token1 : this.token0)

      return [outputAmount, new ComposableStablePool(this.token0, this.token1, updatedPool, updatedWrapper)]
    }

    // If the output token is wrapped, first calculate the output amount then wrap it
    const [outputAmount, updatedPool]: [CurrencyAmount<NativeToken>, BalancerComposableStablePool] =
      await this.pool.getOutputAmount(inputAmount, zeroForOne ? this.token1 : this.token0)
    const [wrappedAmount, updatedWrapper]: [CurrencyAmount<NativeToken>, ComposableStablePoolWrapper] =
      await this.wrapper.getInputAmount(outputAmount)

    return [wrappedAmount, new ComposableStablePool(this.token0, this.token1, updatedPool, updatedWrapper)]
  }

  /**
   * Given an output amount of a token, return the computed input amount, and a pool with state updated after the trade
   * @param _outputAmount The output amount for which to quote the input amount
   * @param inputToken The token from which the input amount should correspond (defaults to BPT if not specified)
   * @returns The input amount and the pool with updated state
   * @throws if token is not in the pool
   * @throws if inputToken is not in the pool
   * @throws if token and inputToken are the same
   */
  public async getInputAmount(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _outputAmount: CurrencyAmount<NativeToken>
  ): Promise<[CurrencyAmount<NativeToken>, ComposableStablePool]> {
    throw Error('INVALID EXACT TOKEN OUT')
  }
}
