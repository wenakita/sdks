import { BigNumber, parseFixed } from '@ethersproject/bignumber'
import { CurrencyAmount, NativeToken, Price, ROOT_CHAIN_ID } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { BigNumber as OldBigNumber } from '../../utils/balancer/bignumber'
import { ComposableStablePool as BalancerPool } from './balancerPools/composableStable'
import { PhantomStablePoolPairData, PhantomStablePoolToken } from './balancerPools/phantomStablePool'

export class BalancerComposableStablePool extends BalancerPool {
  constructor(
    id: string,
    address: string,
    amp: string,
    swapFee: string,
    totalShares: string,
    tokens: PhantomStablePoolToken[],
    tokensList: string[]
  ) {
    super(id, address, amp, swapFee, totalShares, tokens, tokensList)
    // Additional initialization
  }

  // Methods similar to Uniswap's Pool class but using Balancer logic

  // Method to check if a token is in the pool
  public involvesToken(token: NativeToken): boolean {
    return this.tokens.some((t) => t.address === token.address)
  }

  /**
   * Return the price of the given token in terms of another token in the pool.
   * @param inputToken token to return price of
   * @param outputToken token to return price in terms of
   * @returns price of the given token in terms of another token in the pool
   * @throws if token is not in the pool
   * @throws if otherToken is not in the pool
   * @throws if token and otherToken are the same
   */
  public priceOf(inputToken: NativeToken, outputToken: NativeToken): Price<NativeToken, NativeToken> {
    invariant(this.involvesToken(inputToken), 'TOKEN')
    invariant(this.involvesToken(outputToken), 'OTHER_TOKEN')
    invariant(!inputToken.equals(outputToken), 'SAME_TOKEN')

    // Get price of inputToken in terms of outputToken
    const poolPairData: PhantomStablePoolPairData = this.parsePoolPairData(outputToken.address, inputToken.address)

    const [numerator, denominator] = this._spotPriceExactTokenInForTokenOut(poolPairData)
      .shiftedBy(poolPairData.decimalsIn - poolPairData.decimalsOut)
      .toFraction()

    return new Price(inputToken, outputToken, denominator.toString(), numerator.toString())
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return ROOT_CHAIN_ID
  }

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param outputToken The token to which the output amount should correspond (defaults to BPT if not specified)
   * @returns The output amount and the pool with updated state
   * @throws if token is not in the pool
   * @throws if outputToken is not in the pool
   * @throws if token and outputToken are the same
   */
  public async getOutputAmount(
    inputAmount: CurrencyAmount<NativeToken>,
    outputToken?: NativeToken
  ): Promise<[CurrencyAmount<NativeToken>, BalancerComposableStablePool]> {
    outputToken = this._checkInput(inputAmount.currency, outputToken)

    const poolPairData: PhantomStablePoolPairData = this.parsePoolPairData(
      inputAmount.currency.address,
      outputToken.address
    )
    const { balanceIn, balanceOut, tokenIn, tokenOut } = poolPairData

    const inputAmountOldBigNumber = new OldBigNumber(inputAmount.toExact())
    const outputAmount = this._exactTokenInForTokenOut(poolPairData, inputAmountOldBigNumber)

    const updatedPool: BalancerComposableStablePool = this.updateNewPool(
      tokenIn,
      balanceIn,
      inputAmountOldBigNumber,
      poolPairData,
      tokenOut,
      balanceOut,
      outputAmount
    )

    return [CurrencyAmount.fromRawAmount(outputToken, outputAmount.toString()), updatedPool]
  }

  /**
   * Given an output amount of a token, return the computed input amount, and a pool with state updated after the trade
   * @param outputAmount The output amount for which to quote the input amount
   * @param inputToken The token from which the input amount should correspond (defaults to BPT if not specified)
   * @returns The input amount and the pool with updated state
   * @throws if token is not in the pool
   * @throws if inputToken is not in the pool
   * @throws if token and inputToken are the same
   */
  public async getInputAmount(
    outputAmount: CurrencyAmount<NativeToken>,
    inputToken?: NativeToken
  ): Promise<[CurrencyAmount<NativeToken>, BalancerComposableStablePool]> {
    inputToken = this._checkInput(outputAmount.currency, inputToken)

    const poolPairData: PhantomStablePoolPairData = this.parsePoolPairData(
      inputToken.address,
      outputAmount.currency.address
    )
    const { balanceIn, balanceOut, tokenIn, tokenOut } = poolPairData

    const outputAmountOldBigNumber = new OldBigNumber(outputAmount.toExact())
    const inputAmount = this._tokenInForExactTokenOut(poolPairData, outputAmountOldBigNumber)

    const updatedPool: BalancerComposableStablePool = this.updateNewPool(
      tokenIn,
      balanceIn,
      inputAmount,
      poolPairData,
      tokenOut,
      balanceOut,
      outputAmountOldBigNumber
    )

    return [CurrencyAmount.fromRawAmount(inputToken, inputAmount.toString()), updatedPool]
  }

  // Additional Balancer-specific methods and properties

  public static clonePool(poolInstance: BalancerComposableStablePool) {
    // Extracting the properties from the existing instance
    const { id, address, amp, swapFee, totalShares, tokens, tokensList } = poolInstance

    // Creating a new instance with the cloned and original properties
    return new BalancerComposableStablePool(
      id,
      address,
      amp.toString(),
      swapFee.toString(),
      totalShares.toString(),
      tokens,
      tokensList
    )
  }

  public clonePool() {
    return BalancerComposableStablePool.clonePool(this)
  }

  private _checkInput(specifiedToken: NativeToken, returnToken?: NativeToken): NativeToken {
    invariant(this.involvesToken(specifiedToken), 'TOKEN')
    if (returnToken) {
      invariant(this.involvesToken(returnToken), 'INPUT_TOKEN')
    } else {
      returnToken = new NativeToken(ROOT_CHAIN_ID, this.address, 18)
    }
    invariant(!specifiedToken.equals(returnToken), 'SAME_TOKEN')

    return returnToken
  }

  private updateNewPool(
    tokenIn: string,
    balanceIn: BigNumber,
    inputAmount: OldBigNumber,
    poolPairData: PhantomStablePoolPairData,
    tokenOut: string,
    balanceOut: BigNumber,
    outputAmount: OldBigNumber
  ): BalancerComposableStablePool {
    const updatedPool: BalancerComposableStablePool = this.clonePool()

    // Update balances of tokenIn and tokenOut
    updatedPool.updateTokenBalanceForPool(
      tokenIn,
      balanceIn.add(parseFixed(inputAmount.dp(poolPairData.decimalsIn).toString(), poolPairData.decimalsIn))
    )
    updatedPool.updateTokenBalanceForPool(
      tokenOut,
      balanceOut.sub(parseFixed(outputAmount.dp(poolPairData.decimalsOut).toString(), poolPairData.decimalsOut))
    )
    return updatedPool
  }
}
