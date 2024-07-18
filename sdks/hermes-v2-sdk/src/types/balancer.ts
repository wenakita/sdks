import { BigNumber } from '@ethersproject/bignumber'

import { BigNumber as OldBigNumber } from '../utils/balancer/bignumber'

export enum SwapTypes {
  SwapExactIn,
  SwapExactOut,
}

export enum PoolTypes {
  Weighted,
  Stable,
  Element,
  MetaStable,
  Linear,
  Gyro2,
  Gyro3,
  GyroE,
  Fx,
}

export type PoolPairBase = {
  id: string
  address: string
  poolType: PoolTypes
  swapFee: BigNumber
  tokenIn: string
  tokenOut: string
  decimalsIn: number
  decimalsOut: number
  balanceIn: BigNumber
  balanceOut: BigNumber
}

export interface SubgraphPoolBase {
  id: string
  address: string // Can be derived from the poolId
  // We only support Stable Pool V5, so no need for the query to return this
  // poolType: string
  // poolTypeVersion?: number
  swapFee: string
  // We only support Stable Pool V5, where pausing is no longer enabled
  // swapEnabled: boolean
  totalShares: string
  tokens: SubgraphToken[]
  tokensList: string[] // This is immutable but we query that to get balances, so no need to save it

  // Stable specific fields
  amp?: string

  // Add other Balancer pool specific fields here
}

export type SubgraphToken = {
  address: string
  balance: string
  decimals: number
  priceRate: string

  // Add other Balancer token specific fields here
}

export enum PoolFilter {
  All = 'All',
  Weighted = 'Weighted',
  Stable = 'Stable',
  MetaStable = 'MetaStable',
  LiquidityBootstrapping = 'LiquidityBootstrapping',
  Investment = 'Investment',
  Element = 'Element',
  StablePhantom = 'StablePhantom',
  ComposableStable = 'ComposableStable',
  Gyro2 = 'Gyro2',
  Gyro3 = 'Gyro3',
  GyroE = 'GyroE',
  // Linear Pools defined below all operate the same mathematically but have different factories and names in Subgraph
  AaveLinear = 'AaveLinear',
  Linear = 'Linear',
  EulerLinear = 'EulerLinear',
  ERC4626Linear = 'ERC4626Linear',
  BeefyLinear = 'BeefyLinear',
  GearboxLinear = 'GearboxLinear',
  MidasLinear = 'MidasLinear',
  ReaperLinear = 'ReaperLinear',
  SiloLinear = 'SiloLinear',
  TetuLinear = 'TetuLinear',
  YearnLinear = 'YearnLinear',
  FX = 'FX',
}

export interface PoolBase<D extends PoolPairBase = PoolPairBase> {
  poolType: PoolTypes
  id: string
  address: string
  tokensList: string[]
  tokens: { address: string; balance: string; decimals: number }[]
  totalShares: BigNumber
  mainIndex?: number
  isLBP?: boolean
  getNormalizedLiquidity: (poolPairData: D) => OldBigNumber
  getLimitAmountSwap: (poolPairData: D, swapType: SwapTypes) => OldBigNumber
  /**
   * @param {string} token - Address of token.
   * @param {BigNumber} newBalance - New balance of token. EVM scaled.
   */
  updateTokenBalanceForPool: (token: string, newBalance: BigNumber) => void
  updateTotalShares: (newTotalShares: BigNumber) => void
  _exactTokenInForTokenOut: (poolPairData: D, amount: OldBigNumber) => OldBigNumber
  _tokenInForExactTokenOut: (poolPairData: D, amount: OldBigNumber) => OldBigNumber
  _calcTokensOutGivenExactBptIn(bptAmountIn: BigNumber): BigNumber[]
  _calcBptOutGivenExactTokensIn(amountsIn: BigNumber[]): BigNumber
  _spotPriceAfterSwapExactTokenInForTokenOut: (poolPairData: D, amount: OldBigNumber) => OldBigNumber
  _spotPriceAfterSwapTokenInForExactTokenOut: (poolPairData: D, amount: OldBigNumber) => OldBigNumber
  _derivativeSpotPriceAfterSwapExactTokenInForTokenOut: (poolPairData: D, amount: OldBigNumber) => OldBigNumber
  _derivativeSpotPriceAfterSwapTokenInForExactTokenOut: (poolPairData: D, amount: OldBigNumber) => OldBigNumber
}
