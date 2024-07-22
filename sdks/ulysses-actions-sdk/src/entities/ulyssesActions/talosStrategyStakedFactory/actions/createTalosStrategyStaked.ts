import { ROOT_CHAIN_ID, TalosAddresses, ZERO_ADDRESS } from 'maia-core-sdk'
import { TalosStrategyStakedFactory, TCreateTalosStrategyStakedParams } from 'talos-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title CreateTalosStrategyStakedAction class
 * @notice Provides a set of function to encode calldata to create a Talos Staked Strategy using Talos Strategy Staked Factory contract.
 * @author MaiaDAO
 */
export class CreateTalosStrategyStakedAction implements IAction<TCreateTalosStrategyStakedParams, IActionResult<void>> {
  params: TCreateTalosStrategyStakedParams

  /**
   * Constructor for the CreateTalosStrategyStaked class.
   * @param params the parameters for the create Talos Strategy Staked action in Talos Strategy.
   * @returns a new instance of CreateTalosStrategyStakedAction.
   * @notice the constructor is used to set the parameters for the create Talos Strategy Staked action.
   */
  constructor(params: TCreateTalosStrategyStakedParams) {
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to create a Talos manager.
   * @param params the parameters for the create Talos Strategy Staked action in Talos Strategy.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Strategy Staked action.
   */
  public encode(params: TCreateTalosStrategyStakedParams): IActionResult<IActionResult<void>> {
    return {
      target: TalosAddresses[ROOT_CHAIN_ID]?.talosOptimizerFactory ?? ZERO_ADDRESS,
      params: { calldata: TalosStrategyStakedFactory.encodeCreateTalosBaseStrategyParams(params), value: '0' },
    }
  }
}
