import { BigNumber, formatFixed, parseFixed } from '@ethersproject/bignumber'
import { WeiPerEther as ONE, Zero } from '@ethersproject/constants'

import {
  PoolBase,
  PoolPairBase,
  PoolTypes,
  SubgraphPoolBase,
  SubgraphToken,
  SwapTypes,
} from '../../../../types/balancer'
import { denormaliseAmount, isSameAddress, normaliseAmount, normaliseBalance } from '../../../../utils/balancer'
import { BigNumber as OldBigNumber, bnum, scale, ZERO } from '../../../../utils/balancer/bignumber'
import { universalNormalizedLiquidity } from '../liquidity'
import {
  _derivativeSpotPriceAfterSwapExactTokenInForTokenOut,
  _derivativeSpotPriceAfterSwapTokenInForExactTokenOut,
  _spotPriceAfterSwapExactTokenInForTokenOut,
  _spotPriceAfterSwapTokenInForExactTokenOut,
} from './stableMath'
import {
  _calcBptOutGivenExactTokensIn,
  _calcInGivenOut,
  _calcOutGivenIn,
  _calcTokensOutGivenExactBptIn,
} from './stableMathBigInt'

type StablePoolToken = Pick<SubgraphToken, 'address' | 'balance' | 'decimals'>

export type StablePoolPairData = PoolPairBase & {
  allBalances: OldBigNumber[]
  allBalancesScaled: BigNumber[] // EVM Maths uses everything in 1e18 upscaled format and this avoids repeated scaling
  amp: BigNumber
  tokenIndexIn: number
  tokenIndexOut: number
}

export class StablePool implements PoolBase<StablePoolPairData> {
  poolType: PoolTypes = PoolTypes.Stable
  id: string
  address: string
  amp: BigNumber
  swapFee: BigNumber
  totalShares: BigNumber
  tokens: StablePoolToken[]
  tokensList: string[]
  MAX_IN_RATIO = parseFixed('0.3', 18)
  MAX_OUT_RATIO = parseFixed('0.3', 18)

  static AMP_DECIMALS = 3

  static fromPool(pool: SubgraphPoolBase): StablePool {
    if (!pool.amp) throw new Error('StablePool missing amp factor')
    return new StablePool(pool.id, pool.address, pool.amp, pool.swapFee, pool.totalShares, pool.tokens, pool.tokensList)
  }

  constructor(
    id: string,
    address: string,
    amp: string,
    swapFee: string,
    totalShares: string,
    tokens: StablePoolToken[],
    tokensList: string[]
  ) {
    this.id = id
    this.address = address
    this.amp = parseFixed(amp, StablePool.AMP_DECIMALS)
    this.swapFee = parseFixed(swapFee, 18)
    this.totalShares = parseFixed(totalShares, 18)
    this.tokens = tokens
    this.tokensList = tokensList
  }

  getNormalizedLiquidity(poolPairData: StablePoolPairData): OldBigNumber {
    return universalNormalizedLiquidity(this._derivativeSpotPriceAfterSwapExactTokenInForTokenOut(poolPairData, ZERO))
  }

  getLimitAmountSwap(poolPairData: PoolPairBase, swapType: SwapTypes): OldBigNumber {
    // We multiply ratios by 10**-18 because we are in normalized space
    // so 0.5 should be 0.5 and not 500000000000000000
    // TODO: update bmath to use everything normalized
    if (swapType === SwapTypes.SwapExactIn) {
      return bnum(formatFixed(poolPairData.balanceIn.mul(this.MAX_IN_RATIO).div(ONE), poolPairData.decimalsIn))
    } else {
      return bnum(formatFixed(poolPairData.balanceOut.mul(this.MAX_OUT_RATIO).div(ONE), poolPairData.decimalsOut))
    }
  }

  // Updates the balance of a given token for the pool
  updateTokenBalanceForPool(token: string, newBalance: BigNumber): void {
    // token is BPT
    if (isSameAddress(this.address, token)) {
      this.updateTotalShares(newBalance)
    } else {
      // token is underlying in the pool
      const T = this.tokens.find((t) => isSameAddress(t.address, token))
      if (!T) throw Error('Pool does not contain this token')
      T.balance = formatFixed(newBalance, T.decimals)
    }
  }

  updateTotalShares(newTotalShares: BigNumber): void {
    this.totalShares = newTotalShares
  }

  _exactTokenInForTokenOut(poolPairData: StablePoolPairData, amount: OldBigNumber): OldBigNumber {
    try {
      if (amount.isZero()) return ZERO

      const amtWithFeeEvm = this.subtractSwapFeeAmount(
        parseFixed(amount.dp(poolPairData.decimalsIn).toString(), poolPairData.decimalsIn),
        poolPairData.swapFee
      )

      // All values should use 1e18 fixed point
      // i.e. 1USDC => 1e18 not 1e6
      const amtScaled = amtWithFeeEvm.mul(10 ** (18 - poolPairData.decimalsIn))

      const amt = _calcOutGivenIn(
        this.amp.toBigInt(),
        poolPairData.allBalancesScaled.map((balance) => balance.toBigInt()),
        poolPairData.tokenIndexIn,
        poolPairData.tokenIndexOut,
        amtScaled.toBigInt(),
        BigInt(0)
      )

      // return normalised amount
      // Using BigNumber.js decimalPlaces (dp), allows us to consider token decimal accuracy correctly,
      // i.e. when using token with 2decimals 0.002 should be returned as 0
      // Uses ROUND_DOWN mode (1)
      return scale(bnum(amt.toString()), -18).dp(poolPairData.decimalsOut, 1)
    } catch (err) {
      // console.error(`_evmoutGivenIn: ${err.message}`);
      return ZERO
    }
  }

  _tokenInForExactTokenOut(poolPairData: StablePoolPairData, amount: OldBigNumber): OldBigNumber {
    try {
      if (amount.isZero()) return ZERO
      // All values should use 1e18 fixed point
      // i.e. 1USDC => 1e18 not 1e6
      const amtScaled = parseFixed(amount.dp(18).toString(), 18)

      let amt = _calcInGivenOut(
        this.amp.toBigInt(),
        poolPairData.allBalancesScaled.map((balance) => balance.toBigInt()),
        poolPairData.tokenIndexIn,
        poolPairData.tokenIndexOut,
        amtScaled.toBigInt(),
        BigInt(0)
      )

      // this is downscaleUp
      const scaleFactor = BigInt(10 ** (18 - poolPairData.decimalsIn))
      amt = (amt + scaleFactor - BigInt(1)) / scaleFactor

      const amtWithFee = this.addSwapFeeAmount(BigNumber.from(amt), poolPairData.swapFee)
      return bnum(amtWithFee.toString()).div(10 ** poolPairData.decimalsIn)
    } catch (err) {
      // console.error(`_evminGivenOut: ${err.message}`)
      return ZERO
    }
  }

  /**
   * _calcTokensOutGivenExactBptIn
   * @param bptAmountIn EVM scale.
   * @returns EVM scale.
   */
  _calcTokensOutGivenExactBptIn(bptAmountIn: BigNumber): BigNumber[] {
    // balances and amounts must be normalized to 1e18 fixed point - e.g. 1USDC => 1e18 not 1e6
    // takes price rate into account
    const balancesNormalised = this.tokens
      .filter((t) => !isSameAddress(t.address, this.address))
      .map((t) => normaliseBalance(t))
    try {
      const amountsOutNormalised = _calcTokensOutGivenExactBptIn(
        balancesNormalised,
        bptAmountIn.toBigInt(),
        this.totalShares.toBigInt()
      )
      // We want to return denormalised amounts. e.g. 1USDC => 1e6 not 1e18
      const amountsOut = amountsOutNormalised.map((a, i) => denormaliseAmount(a, this.tokens[i]))
      return amountsOut.map((a) => BigNumber.from(a))
    } catch (err) {
      return new Array(balancesNormalised.length).fill(ZERO)
    }
  }

  /**
   * _calcBptOutGivenExactTokensIn
   * @param amountsIn EVM Scale
   * @returns EVM Scale
   */
  _calcBptOutGivenExactTokensIn(amountsIn: BigNumber[]): BigNumber {
    try {
      // balances and amounts must be normalized to 1e18 fixed point - e.g. 1USDC => 1e18 not 1e6
      // takes price rate into account
      const amountsInNormalised = new Array(amountsIn.length).fill(BigInt(0))
      const balancesNormalised = new Array(amountsIn.length).fill(BigInt(0))
      this.tokens
        .filter((t) => !isSameAddress(t.address, this.address))
        .forEach((token, i) => {
          amountsInNormalised[i] = normaliseAmount(BigInt(amountsIn[i].toString()), token)
          balancesNormalised[i] = normaliseBalance(token)
        })
      const bptAmountOut = _calcBptOutGivenExactTokensIn(
        this.amp.toBigInt(),
        balancesNormalised,
        amountsInNormalised,
        this.totalShares.toBigInt(),
        this.swapFee.toBigInt()
      )
      return BigNumber.from(bptAmountOut.toString())
    } catch (err) {
      return Zero
    }
  }

  _spotPriceAfterSwapExactTokenInForTokenOut(poolPairData: StablePoolPairData, amount: OldBigNumber): OldBigNumber {
    return _spotPriceAfterSwapExactTokenInForTokenOut(amount, poolPairData)
  }

  _spotPriceAfterSwapTokenInForExactTokenOut(poolPairData: StablePoolPairData, amount: OldBigNumber): OldBigNumber {
    return _spotPriceAfterSwapTokenInForExactTokenOut(amount, poolPairData)
  }

  _derivativeSpotPriceAfterSwapExactTokenInForTokenOut(
    poolPairData: StablePoolPairData,
    amount: OldBigNumber
  ): OldBigNumber {
    return _derivativeSpotPriceAfterSwapExactTokenInForTokenOut(amount, poolPairData)
  }

  _derivativeSpotPriceAfterSwapTokenInForExactTokenOut(
    poolPairData: StablePoolPairData,
    amount: OldBigNumber
  ): OldBigNumber {
    return _derivativeSpotPriceAfterSwapTokenInForExactTokenOut(amount, poolPairData)
  }

  subtractSwapFeeAmount(amount: BigNumber, swapFee: BigNumber): BigNumber {
    // https://github.com/balancer-labs/balancer-v2-monorepo/blob/c18ff2686c61a8cbad72cdcfc65e9b11476fdbc3/pkg/pool-utils/contracts/BasePool.sol#L466
    const feeAmount = amount.mul(swapFee).add(ONE.sub(1)).div(ONE)
    return amount.sub(feeAmount)
  }

  addSwapFeeAmount(amount: BigNumber, swapFee: BigNumber): BigNumber {
    // https://github.com/balancer-labs/balancer-v2-monorepo/blob/c18ff2686c61a8cbad72cdcfc65e9b11476fdbc3/pkg/pool-utils/contracts/BasePool.sol#L458
    const feeAmount = ONE.sub(swapFee)
    return amount.mul(ONE).add(feeAmount.sub(1)).div(feeAmount)
  }
}
