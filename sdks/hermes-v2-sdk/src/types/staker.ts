import { BigintIsh, NativeToken } from 'maia-core-sdk'

import { Pool } from '../entities'

export type FullWithdrawOptions = ClaimOptions & WithdrawOptions
/**
 * Represents a unique staking program.
 */
export interface IncentiveKey {
  /**
   * The token rewarded for participating in the staking program.
   */
  rewardToken: NativeToken
  /**
   * The pool that the staked positions must provide in.
   */
  pool: Pool
  /**
   * The time when the incentive program begins.
   */
  startTime: BigintIsh
  /**
   * The time that the incentive program ends.
   */
  endTime: BigintIsh
  /**
   * The address which receives any remaining reward tokens at `endTime`.
   */
  refundee: string
}

/**
 * Options to specify when claiming rewards.
 */
export interface ClaimOptions {
  /**
   * The id of the NFT
   */
  tokenId: BigintIsh

  /**
   * Address to send rewards to.
   */
  recipient: string

  /**
   * The amount of `rewardToken` to claim. 0 claims all.
   */
  amount?: BigintIsh
}
/**
 * Options to specify when withdrawing a position.
 */
export interface WithdrawOptions {
  /**
   * Set when withdrawing. The position will be sent to `owner` on withdraw.
   */
  owner: string

  /**
   * Set when withdrawing. `data` is passed to `safeTransferFrom` when transferring the position from contract back to owner.
   */
  data?: string
}

/**
 * Contains the parameters for the withdraw token action in UniswapV3Staker.
 * @param tokenId the tokenId to withdraw.
 * @param to the address to withdraw the token to.
 */
export type TWithdrawTokenParams = {
  tokenId: BigintIsh
  to: string
}

/**
 * Contains the parameters for the claim all rewards action in UniswapV3Staker.
 * @param recipient the recipient of the rewards.
 */
export type TClaimAllRewardsParams = {
  recipient: string
}

/**
 * Contains the parameters for the claim reward action in UniswapV3Staker.
 * @param recipient the recipient of the reward.
 * @param amount the amount of the reward to claim.
 */
export type TClaimRewardParams = {
  recipient: string
  amount: BigintIsh
}

/**
 * Contains the parameters for the create incentive action in UniswapV3Staker.
 * @param pool the uniswapV3Pool pool to create the incentive for.
 * @param startTime the start time for the incentive.
 * @param reward the amount of Hermes rewards for the incentive.
 */
export type TCreateIncentiveParams = {
  pool: string
  startTime: BigintIsh
  reward: BigintIsh
}

/**
 * Contains the parameters for the stake token action in UniswapV3Staker.
 * @param tokenId the tokenId to stake.
 */
export type TStakeTokenParams = {
  tokenId: BigintIsh
}

/**
 * Contains the parameters for the unstake token action in UniswapV3Staker.
 * @param tokenId the tokenId to unstake.
 */
export type TUnstakeTokenParams = {
  tokenId: BigintIsh
}
