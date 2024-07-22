import { ROOT_CHAIN_ID, TalosAddresses, ZERO_ADDRESS } from 'maia-core-sdk'
import { TalosOptimizerFactory, TCreateTalosOptimizerParams } from 'talos-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title CreateTalosOptimizerAction class
 * @notice Provides a set of function to encode calldata to create a Talos Optimizer using Talos Optimizer Factory contract.
 * @author MaiaDAO
 */
export class CreateTalosOptimizerAction implements IAction<TCreateTalosOptimizerParams, IActionResult<void>> {
  params: TCreateTalosOptimizerParams

  /**
   * Constructor for the CreateTalosOptimizer class.
   * @param params the parameters for the create Talos Manager action in Talos Strategy.
   * @returns a new instance of CreateTalosOptimizer.
   * @notice the constructor is used to set the parameters for the create Talos Manager action in Talos Strategy.
   */
  constructor(params: TCreateTalosOptimizerParams) {
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to create a Talos manager.
   * @param params the parameters for the create Talos Manager action in Talos Strategy.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Manager action.
   */
  public encode(params: TCreateTalosOptimizerParams): IActionResult<IActionResult<void>> {
    return {
      target: TalosAddresses[ROOT_CHAIN_ID]?.talosOptimizerFactory ?? ZERO_ADDRESS,
      params: { calldata: TalosOptimizerFactory.encodeCreateTalosOptimizerParams(params), value: '0' },
    }
  }
}
