import { TalosBaseStrategy, TStrategyDepositParams } from 'talos-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title StrategyDepositAction class
 * @notice Provides a set of function to encode calldata to deposit into Talos Strategy contract.
 * @author MaiaDAO
 */
export class StrategyDepositAction implements IAction<TStrategyDepositParams, IActionResult<void>> {
  target: string
  params: TStrategyDepositParams

  /**
   * Constructor for the StrategyDepositAction class.
   * @param strategy the address of the strategy to deposit into.
   * @param params the parameters for the strategy deposit action in Talos Strategy.
   * @returns a new instance of StrategyDepositAction.
   * @notice the constructor is used to set the parameters for the strategy deposit action in Talos Strategy.
   */
  constructor(strategy: string, params: TStrategyDepositParams) {
    this.target = strategy
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to deposit into Talos Strategy.
   * @param params the parameters for the strategy deposit action in Talos Strategy.
   * @returns the target contract, encoded calldata and message value to send onchain for the strategy deposit action.
   */
  public encode(params: TStrategyDepositParams): IActionResult<IActionResult<void>> {
    return {
      target: this.target,
      params: { calldata: TalosBaseStrategy.encodeStrategyDepositParams(params), value: '0' },
    }
  }
}
