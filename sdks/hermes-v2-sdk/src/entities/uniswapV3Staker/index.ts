import { Interface } from '@ethersproject/abi'
import { ZERO } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import UniswapV3StakerABI from '../../abis/UniswapV3Staker.json'
import { ADDRESS_ZERO } from '../../constants//constants'
import {
  TClaimAllRewardsParams,
  TClaimRewardParams,
  TCreateIncentiveParams,
  TStakeTokenParams,
  TUnstakeTokenParams,
  TWithdrawTokenParams,
} from '../../types/staker'

export abstract class UniswapV3Staker {
  public static readonly INTERFACE: Interface = new Interface(UniswapV3StakerABI)
  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   * Encodes the contract interaction calldata to create an incentive for a pool.
   * @param pool address of the pool to incentivize.
   * @param startTime start time of the incentive.
   * @param reward reward amount for the incentive.
   * @returns the encoded calldata for the createIncentive action.
   */
  public static encodeCreateIncentiveCalldata({ pool, startTime, reward }: TCreateIncentiveParams) {
    // Check if the pool address, start time and reward amount are valid.
    invariant(pool, 'Invalid pool address')
    invariant(pool != ADDRESS_ZERO, 'Invalid pool address')
    invariant(startTime > ZERO, 'Invalid start time')
    invariant(reward > ZERO, 'Invalid reward amount')
    // Encode the createIncentive action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('createIncentive', [
      {
        pool,
        startTime,
      },
      reward,
    ])
  }

  /**
   * Encodes the contract interaction calldata to withdraw a token from the staker.
   * @param tokenId id of the token to withdraw.
   * @param to address to withdraw the token to.
   * @returns the encoded calldata for the withdrawToken action.
   */
  public static encodeWithdrawTokenCalldata({ tokenId, to }: TWithdrawTokenParams) {
    // Check if the token id and recipient address are valid.
    invariant(tokenId, 'Invalid token id')
    invariant(to, 'Invalid recipient address')
    invariant(to != ADDRESS_ZERO, 'Invalid recipient address')
    // Encode the withdrawToken action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('withdrawToken', [tokenId, to])
  }

  /**
   * Encodes the contract interaction calldata to unstake a token from the staker.
   * @param tokenId id of the token to unstake.
   * @returns the encoded calldata for the unstakeToken action.
   */
  public static encodeUnstakeTokenCalldata({ tokenId }: TUnstakeTokenParams) {
    // Check if the token id is valid.
    invariant(tokenId, 'Invalid token id')
    // Encode the unstakeToken action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('unstakeToken', [tokenId])
  }

  /**
   * Encodes the contract interaction calldata to stake a token in the staker.
   * @param tokenId id of the token to stake.
   * @returns the encoded calldata for the stake action.
   */
  public static encodeStakeTokenCalldata({ tokenId }: TStakeTokenParams) {
    // Check if the token id is valid.
    invariant(tokenId, 'Invalid token id')
    // Encode the stake action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('stakeToken', [tokenId])
  }

  /**
   * Encodes the contract interaction calldata to restake a token in the staker.
   * @param tokenId id of the token to restake.
   * @returns the encoded calldata for the restake action.
   */
  public static encodeRestakeTokenCalldata({ tokenId }: TStakeTokenParams) {
    // Check if the token id is valid.
    invariant(tokenId, 'Invalid token id')
    // Encode the restake action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('restakeToken', [tokenId])
  }

  /**
   * Encodes the contract interaction calldata to claim reward from the staker.
   * @param recipient address of the recipient of the reward.
   * @param amount amount of reward to claim.
   * @returns the encoded calldata for the claimReward action.
   */
  public static encodeClaimRewardCalldata({ recipient, amount }: TClaimRewardParams) {
    // Check if the recipient address and amount requested are valid.
    invariant(recipient, 'Invalid recipient address')
    invariant(recipient != ADDRESS_ZERO, 'Invalid recipient address')
    invariant(amount > ZERO, 'Invalid amount requested')
    // Encode the claimReward action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('claimReward', [recipient, amount])
  }

  /**
   * Encodes the contract interaction calldata to claim all rewards from the staker.
   * @param recipient address of the recipient of the reward.
   * @returns the encoded calldata for the claimAllRewards action.
   */
  public static encodeClaimAllRewardsCalldata({ recipient }: TClaimAllRewardsParams) {
    // Check if the recipient address is valid.
    invariant(recipient, 'Invalid recipient address')
    invariant(recipient != ADDRESS_ZERO, 'Invalid recipient address')
    // Encode the claimAllRewards action.
    return UniswapV3Staker.INTERFACE.encodeFunctionData('claimAllRewards', [recipient])
  }
}
