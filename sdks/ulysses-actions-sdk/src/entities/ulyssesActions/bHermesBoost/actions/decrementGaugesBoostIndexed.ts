import { BHermesBoost, TDecrementGaugesBoostIndexedParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DecrementGaugesBoostIndexedAction class
 * @notice Provides a set of function to encode calldata for the decrement gauges boost indexed action in bHermesBoost contract.
 * @author MaiaDAO
 */
export class DecrementGaugesBoostIndexedAction
  implements IAction<TDecrementGaugesBoostIndexedParams, IActionResult<void>>
{
  params: TDecrementGaugesBoostIndexedParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DecrementGaugesBoostIndexedAction class.
   * @param params the parameters for the decrement gauges boost indexed action in bHermesBoost.
   * @returns a new instance of DecrementGaugesBoostIndexedAction.
   * @notice the constructor is used to set the parameters for the decrement gauges boost indexed action in bHermesBoost.
   */
  constructor(params: TDecrementGaugesBoostIndexedParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to decrement an amount of boost from all attached gauges in bHermesBoost.
   * @param params the parameters for the decrement gauges boost indexed action in bHermesBoost.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauges boost indexed action.
   */
  public encode(params: TDecrementGaugesBoostIndexedParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesBoost ?? ZERO_ADDRESS,
      params: {
        calldata: BHermesBoost.encodeDecrementGaugesBoostIndexedCalldata(params),
        value: '0',
      },
    }
  }
}
