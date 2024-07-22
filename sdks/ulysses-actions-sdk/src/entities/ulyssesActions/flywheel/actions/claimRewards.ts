import { Flywheel } from 'hermes-v2-sdk'
import { ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimRewardAction class
 * @notice Provides a set of function to encode calldata for the claim reward action from a Flywheel contract.
 * @author MaiaDAO
 */
export class ClaimRewardsAction implements IAction<string, IActionResult<void>> {
  target: string
  params: string

  /**
   * Constructor for the ClaimRewardsAction class.
   * @param flywheel the address of the flywheel contract.
   * @param recipient the recipient for the claim rewards.
   * @returns a new instance of ClaimRewardsAction.
   * @notice the constructor is used to set the parameters for the claim rewards action in the flywheel.
   */
  constructor(flywheel: string, recipient: string) {
    this.target = flywheel
    this.params = recipient
  }

  /**
   * Encodes the contract interaction calldata to claim rewards from a flywheel contract.
   * @param recipient the recipient for the claim rewards action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim rewards action.
   */
  public encode(recipient: string): IActionResult<IActionResult<void>> {
    return {
      target: this.target ?? ZERO_ADDRESS,
      params: { calldata: Flywheel.encodeClaimRewardsCalldata(recipient), value: '0' },
    }
  }
}
