import { YEAR } from '../constants/constants'

type Row = {
  tokenPriceUSD: number
  fullRangeLiquidityUSD: number
  reward: number
  activeLiquidityUSD: number
  startTime: number
  endTime: number
}

export function aprPercentage(row: Row): string {
  const firstPercentage =
    (row.tokenPriceUSD > 0 &&
      row.fullRangeLiquidityUSD > 0 &&
      (
        ((row.reward * row.tokenPriceUSD) / row.fullRangeLiquidityUSD) *
        (YEAR / (row.endTime - row.startTime)) *
        100
      ).toFixed(2)) ||
    '0'

  const secondPercentage =
    (row.tokenPriceUSD > 0 &&
      row.activeLiquidityUSD > 0 &&
      (
        ((row.reward * row.tokenPriceUSD) / row.activeLiquidityUSD) *
        (YEAR / (row.endTime - row.startTime)) *
        100
      ).toFixed(2)) ||
    '0'

  return `${firstPercentage}% - ${secondPercentage}%`
}
