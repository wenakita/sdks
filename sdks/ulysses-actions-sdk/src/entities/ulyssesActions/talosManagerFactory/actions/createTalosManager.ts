import { ROOT_CHAIN_ID, TalosAddresses, ZERO_ADDRESS } from 'maia-core-sdk'
import { TalosManagerFactory, TCreateTalosManagerParams } from 'talos-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title CreateTalosManagerAction class
 * @notice Provides a set of function to encode calldata to create a Talos Manager using Talos Manager Factory contract.
 * @author MaiaDAO
 */
export class CreateTalosManagerAction implements IAction<TCreateTalosManagerParams, IActionResult<void>> {
  params: TCreateTalosManagerParams

  /**
   * Constructor for the CreateTalosManager class.
   * @param params the parameters for the create Talos Manager action in Talos Strategy.
   * @returns a new instance of CreateTalosManager.
   * @notice the constructor is used to set the parameters for the create Talos Manager action in Talos Strategy.
   */
  constructor(params: TCreateTalosManagerParams) {
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to create a Talos manager.
   * @param params the parameters for the create Talos Manager action in Talos Strategy.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Manager action.
   */
  public encode(params: TCreateTalosManagerParams): IActionResult<IActionResult<void>> {
    return {
      target: TalosAddresses[ROOT_CHAIN_ID]?.talosManagerFactory ?? ZERO_ADDRESS,
      params: { calldata: TalosManagerFactory.encodeCreateTalosManagerParams(params), value: '0' },
    }
  }
}
