import { BigNumber, formatFixed } from '@ethersproject/bignumber'
import { WeiPerEther as EONE } from '@ethersproject/constants'

import { StablePoolPairData } from '.'
import { bnum, BigNumber as OldBigNumber, ONE, ZERO } from '../../../../utils/balancer/bignumber'
// All functions are adapted from the solidity ones to be found on:
// https://github.com/balancer-labs/balancer-core-v2/blob/master/contracts/pools/stable/StableMath.sol

// TODO: implement all up and down rounding variations

/**********************************************************************************************
    // invariant                                                                                 //
    // D = invariant to compute                                                                  //
    // A = amplifier                n * D^2 + A * n^n * S * (n^n * P / D^(n−1))                  //
    // S = sum of balances         ____________________________________________                  //
    // P = product of balances    (n+1) * D + ( A * n^n − 1)* (n^n * P / D^(n−1))                //
    // n = number of tokens                                                                      //
    **********************************************************************************************/
export function _invariant(
  A: BigNumber,
  balances: OldBigNumber[] // balances
): OldBigNumber {
  let sum = ZERO
  const totalCoins = balances.length
  for (let i = 0; i < totalCoins; i++) {
    sum = sum.plus(balances[i])
  }
  if (sum.isZero()) {
    return ZERO
  }
  let prevInv = ZERO
  let inv = sum

  // A is passed as an ethers bignumber while maths uses bignumber.js
  const AAdjusted = bnum(formatFixed(A, 3))
  const ATimesNpowN = AAdjusted.times(totalCoins ** totalCoins) // A*n^n

  for (let i = 0; i < 255; i++) {
    let P_D = bnum(totalCoins).times(balances[0])
    for (let j = 1; j < totalCoins; j++) {
      //P_D is rounded up
      P_D = P_D.times(balances[j]).times(totalCoins).div(inv)
    }
    prevInv = inv
    //inv is rounded up
    inv = bnum(totalCoins)
      .times(inv)
      .times(inv)
      .plus(ATimesNpowN.times(sum).times(P_D))
      .div(
        bnum(totalCoins + 1)
          .times(inv)
          .plus(ATimesNpowN.minus(1).times(P_D))
      )
    // Equality with the precision of 1
    if (inv.gt(prevInv)) {
      if (inv.minus(prevInv).lt(bnum(10 ** -18))) {
        break
      }
    } else if (prevInv.minus(inv).lt(bnum(10 ** -18))) {
      break
    }
  }
  //Result is rounded up
  return inv
}

// Adapted from StableMath.sol, _outGivenIn()
// * Added swap fee at very first line
/**********************************************************************************************
    // outGivenIn token x for y - polynomial equation to solve                                   //
    // ay = amount out to calculate                                                              //
    // by = balance token out                                                                    //
    // y = by - ay                                                                               //
    // D = invariant                               D                     D^(n+1)                 //
    // A = amplifier               y^2 + ( S - ----------  - 1) * y -  ------------- = 0         //
    // n = number of tokens                    (A * n^n)               A * n^2n * P              //
    // S = sum of final balances but y                                                           //
    // P = product of final balances but y                                                       //
    **********************************************************************************************/
export function _exactTokenInForTokenOut(amount: OldBigNumber, poolPairData: StablePoolPairData): OldBigNumber {
  // The formula below returns some dust (due to rounding errors) but when
  // we input zero the output should be zero
  if (amount.isZero()) return amount
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } = poolPairData
  const balances = [...allBalances]
  const n = balances.length
  const A = amp.div(n ** (n - 1))
  let tokenAmountIn = amount
  tokenAmountIn = tokenAmountIn.times(EONE.sub(swapFee).toString()).div(EONE.toString())

  //Invariant is rounded up
  const inv = _invariant(A, balances)
  let p = inv
  let sum = ZERO
  const totalCoins = bnum(balances.length)
  let n_pow_n = ONE
  let x = ZERO
  for (let i = 0; i < balances.length; i++) {
    n_pow_n = n_pow_n.times(totalCoins)

    if (i == tokenIndexIn) {
      x = balances[i].plus(tokenAmountIn)
    } else if (i != tokenIndexOut) {
      x = balances[i]
    } else {
      continue
    }
    sum = sum.plus(x)
    //Round up p
    p = p.times(inv).div(x)
  }

  //Calculate out balance
  const y = _solveAnalyticalBalance(sum, inv, A, n_pow_n, p)

  //Result is rounded down
  // return balances[tokenIndexOut] > y ? balances[tokenIndexOut].minus(y) : 0;
  return balances[tokenIndexOut].minus(y)
}

// Adapted from StableMath.sol, _inGivenOut()
// * Added swap fee at very last line
/**********************************************************************************************
    // inGivenOut token x for y - polynomial equation to solve                                   //
    // ax = amount in to calculate                                                               //
    // bx = balance token in                                                                     //
    // x = bx + ax                                                                               //
    // D = invariant                               D                     D^(n+1)                 //
    // A = amplifier               x^2 + ( S - ----------  - 1) * x -  ------------- = 0         //
    // n = number of tokens                    (A * n^n)               A * n^2n * P              //
    // S = sum of final balances but x                                                           //
    // P = product of final balances but x                                                       //
    **********************************************************************************************/
export function _tokenInForExactTokenOut(amount: OldBigNumber, poolPairData: StablePoolPairData): OldBigNumber {
  // The formula below returns some dust (due to rounding errors) but when
  // we input zero the output should be zero
  if (amount.isZero()) return amount
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } = poolPairData
  const balances = [...allBalances]
  const n = balances.length
  const A = amp.div(n ** (n - 1))
  const tokenAmountOut = amount
  //Invariant is rounded up
  const inv = _invariant(A, balances)
  let p = inv
  let sum = ZERO
  const totalCoins = bnum(balances.length)
  let n_pow_n = ONE
  let x = ZERO
  for (let i = 0; i < balances.length; i++) {
    n_pow_n = n_pow_n.times(totalCoins)

    if (i == tokenIndexOut) {
      x = balances[i].minus(tokenAmountOut)
    } else if (i != tokenIndexIn) {
      x = balances[i]
    } else {
      continue
    }
    sum = sum.plus(x)
    //Round up p
    p = p.times(inv).div(x)
  }

  //Calculate in balance
  const y = _solveAnalyticalBalance(sum, inv, A, n_pow_n, p)

  //Result is rounded up
  return y.minus(balances[tokenIndexIn]).multipliedBy(EONE.toString()).div(EONE.sub(swapFee).toString())
}

//This function calcuates the analytical solution to find the balance required
export function _solveAnalyticalBalance(
  sum: OldBigNumber,
  inv: OldBigNumber,
  A: BigNumber,
  n_pow_n: OldBigNumber,
  p: OldBigNumber
): OldBigNumber {
  // A is passed as an ethers bignumber while maths uses bignumber.js
  const oldBN_A = bnum(formatFixed(A, 3))
  //Round up p
  p = p.times(inv).div(oldBN_A.times(n_pow_n).times(n_pow_n))
  //Round down b
  const b = sum.plus(inv.div(oldBN_A.times(n_pow_n)))
  const c = inv.minus(b).plus(inv.minus(b).times(inv.minus(b)).plus(p.times(4)).sqrt())
  //Round up y
  return c.div(2)
}

//////////////////////
////  These functions have been added exclusively for the SORv2
//////////////////////

function _poolDerivatives(
  A: BigNumber,
  balances: OldBigNumber[],
  tokenIndexIn: number,
  tokenIndexOut: number,
  is_first_derivative: boolean,
  wrt_out: boolean
): OldBigNumber {
  const totalCoins = balances.length
  const D = _invariant(A, balances)
  let S = ZERO
  for (let i = 0; i < totalCoins; i++) {
    if (i != tokenIndexIn && i != tokenIndexOut) {
      S = S.plus(balances[i])
    }
  }
  const x = balances[tokenIndexIn]
  const y = balances[tokenIndexOut]
  // A is passed as an ethers bignumber while maths uses bignumber.js
  const AAdjusted = bnum(formatFixed(A, 3))
  const a = AAdjusted.times(totalCoins ** totalCoins) // = ATimesNpowN
  const b = S.minus(D).times(a).plus(D)
  const twoaxy = bnum(2).times(a).times(x).times(y)
  const partial_x = twoaxy.plus(a.times(y).times(y)).plus(b.times(y))
  const partial_y = twoaxy.plus(a.times(x).times(x)).plus(b.times(x))
  let ans
  if (is_first_derivative) {
    ans = partial_x.div(partial_y)
  } else {
    const partial_xx = bnum(2).times(a).times(y)
    const partial_yy = bnum(2).times(a).times(x)
    const partial_xy = partial_xx.plus(partial_yy).plus(b)
    const numerator = bnum(2)
      .times(partial_x)
      .times(partial_y)
      .times(partial_xy)
      .minus(partial_xx.times(partial_y.pow(2)))
      .minus(partial_yy.times(partial_x.pow(2)))
    const denominator = partial_x.pow(2).times(partial_y)
    ans = numerator.div(denominator)
    if (wrt_out) {
      ans = ans.times(partial_y).div(partial_x)
    }
  }
  return ans
}

/////////
/// SpotPriceAfterSwap
/////////

// PairType = 'token->token'
// SwapType = 'swapExactIn'
export function _spotPriceAfterSwapExactTokenInForTokenOut(
  amount: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } = poolPairData
  const balances = [...allBalances]
  const n = balances.length
  const A = amp.div(n ** (n - 1))
  balances[tokenIndexIn] = balances[tokenIndexIn].plus(amount.times(EONE.sub(swapFee).toString()).div(EONE.toString()))
  balances[tokenIndexOut] = balances[tokenIndexOut].minus(_exactTokenInForTokenOut(amount, poolPairData))
  let ans = _poolDerivatives(A, balances, tokenIndexIn, tokenIndexOut, true, false)
  ans = ONE.div(ans.times(EONE.sub(swapFee).toString()).div(EONE.toString()))
  return ans
}

// PairType = 'token->token'
// SwapType = 'swapExactOut'
export function _spotPriceAfterSwapTokenInForExactTokenOut(
  amount: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } = poolPairData
  const balances = [...allBalances]
  const n = balances.length
  const A = amp.div(n ** (n - 1))
  const _in = _tokenInForExactTokenOut(amount, poolPairData).times(EONE.sub(swapFee).toString()).div(EONE.toString())
  balances[tokenIndexIn] = balances[tokenIndexIn].plus(_in)
  balances[tokenIndexOut] = balances[tokenIndexOut].minus(amount)
  let ans = _poolDerivatives(A, balances, tokenIndexIn, tokenIndexOut, true, true)
  ans = ONE.div(ans.times(EONE.sub(swapFee).toString()).div(EONE.toString()))
  return ans
}

/////////
///  Derivatives of spotPriceAfterSwap
/////////

// PairType = 'token->token'
// SwapType = 'swapExactIn'
export function _derivativeSpotPriceAfterSwapExactTokenInForTokenOut(
  amount: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } = poolPairData
  const balances = [...allBalances]
  const n = balances.length
  const A = amp.div(n ** (n - 1))
  balances[tokenIndexIn] = balances[tokenIndexIn].plus(amount.times(EONE.sub(swapFee).toString()).div(EONE.toString()))
  balances[tokenIndexOut] = balances[tokenIndexOut].minus(_exactTokenInForTokenOut(amount, poolPairData))
  return _poolDerivatives(A, balances, tokenIndexIn, tokenIndexOut, false, false)
}

// PairType = 'token->token'
// SwapType = 'swapExactOut'
export function _derivativeSpotPriceAfterSwapTokenInForExactTokenOut(
  amount: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } = poolPairData
  const balances = [...allBalances]
  const n = balances.length
  const A = amp.div(n ** (n - 1))
  const _in = _tokenInForExactTokenOut(amount, poolPairData).times(EONE.sub(swapFee).toString()).div(EONE.toString())
  balances[tokenIndexIn] = balances[tokenIndexIn].plus(_in)
  balances[tokenIndexOut] = balances[tokenIndexOut].minus(amount)
  const feeFactor = EONE.div(swapFee).toString()
  return _poolDerivatives(A, balances, tokenIndexIn, tokenIndexOut, false, true).div(feeFactor)
}
