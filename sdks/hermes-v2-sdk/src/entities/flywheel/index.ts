import { Interface } from '@ethersproject/abi'
import { ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import FlywheelABI from '../../abis/FlywheelCore.json'

/**
 * Class to handle the Flywheel functionalities, such as claiming rewards for a staked Talos positions and for claiming bribes.
 */
export abstract class Flywheel {
  public static readonly INTERFACE: Interface = new Interface(FlywheelABI)
  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  public constructor() {
    /* TODO document why this constructor is empty */
  }

  /**
   * Encodes the contract interaction calldata to accrue rewards for a strategy and user.
   * @param strategy address of the strategy to accrue rewards for.
   * @param user address of the user to accrue rewards for.
   * @returns the encoded calldata for the accrue action.
   */
  public static encodeAccrueCalldata(strategy: string, user: string) {
    // Check if the strategy and user address are valid.
    invariant(strategy, 'Invalid strategy address')
    invariant(strategy !== ZERO_ADDRESS, 'Invalid strategy address can not be zero address')
    invariant(user, 'Invalid user address')
    invariant(user !== ZERO_ADDRESS, 'Invalid user address can not be zero address')
    // Encode the accrue action.
    return Flywheel.INTERFACE.encodeFunctionData('accrue', [strategy, user])
  }

  /**
   * Encodes the contract interaction calldata to claim rewards from a Flywheel contract.
   * @param address address of the user to claim rewards for.
   * @returns the encoded calldata for the claimRewards action.
   */
  public static encodeClaimRewardsCalldata(address: string) {
    // Check if the user address is valid.
    invariant(address, 'Invalid address')
    invariant(address !== ZERO_ADDRESS, 'Invalid address can not be zero address')
    // Encode the claimRewards action.
    return Flywheel.INTERFACE.encodeFunctionData('claimRewards', [address])
  }
}
