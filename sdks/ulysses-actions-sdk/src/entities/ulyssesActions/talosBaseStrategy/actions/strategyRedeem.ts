import { TalosBaseStrategy, TStrategyRedeemParams } from 'talos-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title StrategyRedeemAction class
 * @notice Provides a set of function to encode calldata to redeem from Talos Strategy contract.
 * @author MaiaDAO
 */
export class StrategyRedeemAction implements IAction<TStrategyRedeemParams, IActionResult<void>> {
  target: string
  params: TStrategyRedeemParams

  /**
   * Constructor for the StrategyRedeemAction class.
   * @param strategy the address of the strategy to redeem from.
   * @param params the parameters for the strategy redeem action in Talos Strategy.
   * @returns a new instance of StrategyRedeemAction.
   * @notice the constructor is used to set the parameters for the strategy redeem action in Talos Strategy.
   */
  constructor(strategy: string, params: TStrategyRedeemParams) {
    this.target = strategy
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to redeem into Talos Strategy.
   * @param params the parameters for the strategy redeem action in Talos Strategy.
   * @returns the target contract, encoded calldata and message value to send onchain for the strategy redeem action.
   */
  public encode(params: TStrategyRedeemParams): IActionResult<IActionResult<void>> {
    return {
      target: this.target,
      params: { calldata: TalosBaseStrategy.encodeStrategyRedeemParams(params), value: '0' },
    }
  }
}
