import { MAX_RANGE } from '../constants/constants'
import { convertBasedOnEfficiency, getAmountsCurrentTickUSD } from './tvl'

export function calculateLiquidityData(
  pool?: any,
  incentive?: any,
  token0USD?: any,
  token1USD?: any
): { activeLiquidityUSD: any; fullRangeLiquidityUSD: any } {
  const activeTickLiquidityUSD = getAmountsCurrentTickUSD(
    Number(pool?.sqrtPrice),
    Number(pool?.tick),
    Number(pool?.liquidity),
    Number(pool?.feeTier),
    Number(pool?.token0?.decimals),
    Number(pool?.token1?.decimals),
    Number(token0USD),
    Number(token1USD)
  )
  const activeLiquidityUSD = convertBasedOnEfficiency(activeTickLiquidityUSD, pool?.feeTier, incentive?.minWidth ?? 0)
  const fullRangeLiquidityUSD = convertBasedOnEfficiency(activeTickLiquidityUSD, pool?.feeTier, MAX_RANGE)

  return {
    activeLiquidityUSD,
    fullRangeLiquidityUSD,
  }
}
