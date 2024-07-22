import { ROOT_CHAIN_ID, TalosAddresses, ZERO_ADDRESS } from 'maia-core-sdk'
import { TalosStrategyVanillaFactory, TCreateTalosStrategyVanillaParams } from 'talos-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title CreateTalosStrategyVanillaAction class
 * @notice Provides a set of function to encode calldata to create a Talos Vanilla Strategy using Talos Strategy Vanilla Factory contract.
 * @author MaiaDAO
 */
export class CreateTalosStrategyVanillaAction
  implements IAction<TCreateTalosStrategyVanillaParams, IActionResult<void>>
{
  params: TCreateTalosStrategyVanillaParams

  /**
   * Constructor for the CreateTalosVanillaStakedAction class.
   * @param params the parameters for the create Talos Strategy Vanilla action.
   * @returns a new instance of CreateTalosStrategyVanillaAction.
   * @notice the constructor is used to set the parameters for the create Talos Strategy Vanilla action.
   */
  constructor(params: TCreateTalosStrategyVanillaParams) {
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to create a Talos Strategy Vanilla.
   * @param params the parameters for the create Talos Strategy Vanilla action.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Strategy Vanilla action.
   */
  public encode(params: TCreateTalosStrategyVanillaParams): IActionResult<IActionResult<void>> {
    return {
      target: TalosAddresses[ROOT_CHAIN_ID]?.talosOptimizerFactory ?? ZERO_ADDRESS,
      params: { calldata: TalosStrategyVanillaFactory.encodeCreateTalosBaseStrategyParams(params), value: '0' },
    }
  }
}
