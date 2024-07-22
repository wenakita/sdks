import { IAction, IActionResult } from '../../utils/action'

/**
 * Contains the parameters to wrap any calldata inside a generic action for use in ActionBuilders.
 */
export type TGenericActionParams = IActionResult<void>

/**
 * @title GenericAction class
 * @notice Provides a set of function to store encoded calldata inside a generic action for use in ActionBuilders.
 * @author MaiaDAO
 */
export class GenericAction implements IAction<TGenericActionParams, IActionResult<void>> {
  params: TGenericActionParams

  /**
   * Constructor for the GenericAction class.
   * @param params object instance of IActionResult containing the tx data to wrap inside action.
   * @returns a new instance of GenericAction.
   * @notice the constructor is used to set the calldata to wrap inside action in bHermesGauges.
   * @dev IActionResult.target the target contract to send the calldata to.
   * @dev IActionResult.calldata the encoded calldata to send to the target contract.
   * @dev IActionResult.value the message value to send with the calldata.
   */
  constructor(params: TGenericActionParams) {
    this.params = params
  }

  /**
   * Encodes the contract interaction calldata to decrement a gauge in bHermesGauges.
   * @param params the calldata to wrap inside action in bHermesGauges.
   * @returns the target contract, encoded calldata and message value to send calldata to wrap inside action.
   */
  public encode(params: TGenericActionParams): IActionResult<IActionResult<void>> {
    return {
      target: params.target,
      params: params.params,
    }
  }
}
