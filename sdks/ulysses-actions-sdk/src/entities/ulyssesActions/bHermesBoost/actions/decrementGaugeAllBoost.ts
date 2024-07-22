import { BHermesBoost, TDecrementGaugeAllBoostParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DecrementGaugeAllBoostAction class
 * @notice Provides a set of function to encode calldata for the decrement gauge all boost action in bHermesBoost contract.
 * @author MaiaDAO
 */
export class DecrementGaugeAllBoostAction implements IAction<TDecrementGaugeAllBoostParams, IActionResult<void>> {
  params: TDecrementGaugeAllBoostParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DecrementGaugeAllBoostAction class.
   * @param params the parameters for the decrement gauge all boost action in bHermesBoost.
   * @returns a new instance of DecrementGaugeAllBoostAction.
   * @notice the constructor is used to set the parameters for the decrement gauge all boost action in bHermesBoost.
   */
  constructor(params: TDecrementGaugeAllBoostParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to decrement all of a gauge's boost in bHermesBoost.
   * @param params the parameters for the decrement gauge all boost action in bHermesBoost.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauge all boost action.
   */
  public encode(params: TDecrementGaugeAllBoostParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesBoost ?? ZERO_ADDRESS,
      params: { calldata: BHermesBoost.encodeDecrementGaugeAllBoostCalldata(params), value: '0' },
    }
  }
}
