import { MAX_RANGE } from '../constants/constants'
import { convertBasedOnEfficiency, getAmountsCurrentTickUSD } from './tvl'

export function calculateLiquidityData(
  ethPriceUSD: any,
  pool?: any,
  incentive?: any,
  rewardTokenDerivedETH?: any,
  token0DerivedETH?: any,
  token1DerivedETH?: any
): { tokenPriceUSD?: any; activeLiquidityUSD: any; fullRangeLiquidityUSD: any } {
  const tokenPriceUSD = rewardTokenDerivedETH * ethPriceUSD
  const poolToken0PriceUSD = token0DerivedETH * ethPriceUSD
  const poolToken1PriceUSD = token1DerivedETH * ethPriceUSD
  const activeTickLiquidityUSD = getAmountsCurrentTickUSD(
    Number(pool?.sqrtPrice),
    Number(pool?.tick),
    Number(pool?.liquidity),
    Number(pool?.feeTier),
    Number(pool?.token0?.decimals),
    Number(pool?.token1?.decimals),
    Number(poolToken0PriceUSD),
    Number(poolToken1PriceUSD)
  )
  const activeLiquidityUSD = convertBasedOnEfficiency(activeTickLiquidityUSD, pool?.feeTier, incentive?.minWidth ?? 0)
  const fullRangeLiquidityUSD = convertBasedOnEfficiency(activeTickLiquidityUSD, pool?.feeTier, MAX_RANGE)

  return {
    tokenPriceUSD,
    activeLiquidityUSD,
    fullRangeLiquidityUSD,
  }
}
