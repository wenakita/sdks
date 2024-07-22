import { BHermesBoost, TDecrementAllGaugesBoostParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DecrementAllGaugesBoostAction class
 * @notice Provides a set of function to encode calldata for the decrement all gauges boost action in bHermesBoost contract.
 * @author MaiaDAO
 */
export class DecrementAllGaugesBoostAction implements IAction<TDecrementAllGaugesBoostParams, IActionResult<void>> {
  params: TDecrementAllGaugesBoostParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DecrementAllGaugesBoostAction class.
   * @param params the parameters for the decrement all gauges boost action in bHermesBoost.
   * @returns a new instance of DecrementAllGaugesBoostAction.
   * @notice the constructor is used to set the parameters for the decrement all gauges boost action in bHermesBoost.
   */
  constructor(params: TDecrementAllGaugesBoostParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to decrement an amount of boost from all attached gauges in bHermesBoost.
   * @param params the parameters for the decrement all gauges boost action in bHermesBoost.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement all gauges boost action.
   */
  public encode(params: TDecrementAllGaugesBoostParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesBoost ?? ZERO_ADDRESS,
      params: { calldata: BHermesBoost.encodeDecrementAllGaugesBoostCalldata(params), value: '0' },
    }
  }
}
