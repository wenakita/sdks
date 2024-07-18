import { Interface } from '@ethersproject/abi'
import IQuoterV2 from '@uniswap/swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json'
import IQuoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { Currency, CurrencyAmount, MethodParameters, toHex } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { FeeAmount, TradeType } from '../../constants/constants'
import { QuoteOptions } from '../../types'
import { encodeRouteToPath } from '../../utils/encodeRouteToPath'
import { Pool, Route } from '..'

interface BaseQuoteParams {
  fee: FeeAmount
  sqrtPriceLimitX96: string
  tokenIn: string
  tokenOut: string
}

/**
 * Represents the Uniswap V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */
export abstract class SwapQuoter {
  public static readonly V1INTERFACE: Interface = new Interface(IQuoter.abi)
  public static readonly V2INTERFACE: Interface = new Interface(IQuoterV2.abi)

  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @param options The optional params including price limit and Quoter contract switch
   * @returns The formatted calldata
   */
  public static quoteCallParameters<TPool extends Pool, TInput extends Currency, TOutput extends Currency>(
    route: Route<TPool, TInput, TOutput>,
    amount: CurrencyAmount<TInput | TOutput>,
    tradeType: TradeType,
    options: QuoteOptions = {}
  ): MethodParameters {
    const singleHop = route.pools.length === 1
    const quoteAmount: string = toHex(amount.quotient)
    let calldata: string
    const swapInterface: Interface = options.useQuoterV2 ? this.V2INTERFACE : this.V1INTERFACE

    if (singleHop) {
      const baseQuoteParams: BaseQuoteParams = {
        tokenIn: route.tokenPath[0].address,
        tokenOut: route.tokenPath[1].address,
        fee: (route.pools[0] as Pool).fee,
        sqrtPriceLimitX96: toHex(options?.sqrtPriceLimitX96 ?? 0),
      }

      const v2QuoteParams = {
        ...baseQuoteParams,
        ...(tradeType == TradeType.EXACT_INPUT ? { amountIn: quoteAmount } : { amount: quoteAmount }),
      }

      const v1QuoteParams = [
        baseQuoteParams.tokenIn,
        baseQuoteParams.tokenOut,
        baseQuoteParams.fee,
        quoteAmount,
        baseQuoteParams.sqrtPriceLimitX96,
      ]

      const tradeTypeFunctionName =
        tradeType === TradeType.EXACT_INPUT ? 'quoteExactInputSingle' : 'quoteExactOutputSingle'
      calldata = swapInterface.encodeFunctionData(
        tradeTypeFunctionName,
        options.useQuoterV2 ? [v2QuoteParams] : v1QuoteParams
      )
    } else {
      invariant(options?.sqrtPriceLimitX96 === undefined, 'MULTIHOP_PRICE_LIMIT')
      const path: string = encodeRouteToPath(route, tradeType === TradeType.EXACT_OUTPUT)
      const tradeTypeFunctionName = tradeType === TradeType.EXACT_INPUT ? 'quoteExactInput' : 'quoteExactOutput'
      calldata = swapInterface.encodeFunctionData(tradeTypeFunctionName, [path, quoteAmount])
    }

    return {
      calldata,
      value: toHex(0),
    }
  }
}
