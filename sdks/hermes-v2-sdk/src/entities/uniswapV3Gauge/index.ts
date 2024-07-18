import { Currency } from 'maia-core-sdk'

import { Pool } from '../pool'

type Incentive = {
  rewardToken: Currency
  startTime: bigint
  endTime: bigint
  reward: bigint
  ended: boolean
  stakedLiquidity: bigint
}

/**
 * UniswapV3Gauge entity
 */
export class UniswapV3Gauge {
  // if the gauge is active
  public readonly isActive: boolean

  //associated pool
  public readonly pool: Pool

  //current votes
  public readonly currentGaugeWeight: bigint

  //current boosts
  public readonly currentBoost: bigint

  //current incentiveId
  public readonly currentIncentive: Incentive | undefined

  public readonly minWidth: bigint

  constructor(
    pool: Pool,
    isActive: boolean,
    currentGaugeWeight: bigint,
    currentBoost: bigint,
    minWidth: bigint,
    currentIncentive?: Incentive
  ) {
    this.pool = pool
    this.isActive = isActive
    this.currentGaugeWeight = currentGaugeWeight
    this.currentBoost = currentBoost
    this.currentIncentive = currentIncentive ?? undefined
    this.minWidth = minWidth
  }
}
