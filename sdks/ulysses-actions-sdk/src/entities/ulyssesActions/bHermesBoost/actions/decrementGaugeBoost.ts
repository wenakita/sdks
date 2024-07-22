import { BHermesBoost, TDecrementGaugeBoostParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DecrementGaugeBoostAction class
 * @notice Provides a set of function to encode calldata for the decrement gauge boost action in bHermesBoost contract.
 * @author MaiaDAO
 */
export class DecrementGaugeBoostAction implements IAction<TDecrementGaugeBoostParams, IActionResult<void>> {
  params: TDecrementGaugeBoostParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DecrementGaugeBoostAction class.
   * @param params the parameters for the decrement gauge boost action in bHermesBoost.
   * @returns a new instance of DecrementGaugeBoostAction.
   * @notice the constructor is used to set the parameters for the decrement gauge boost action in bHermesBoost.
   */
  constructor(params: TDecrementGaugeBoostParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to decrement a gauge's boost in bHermesBoost.
   * @param params the parameters for the decrement gauge boost action in bHermesBoost.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauge boost action.
   */
  public encode(params: TDecrementGaugeBoostParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesBoost ?? ZERO_ADDRESS,
      params: { calldata: BHermesBoost.encodeDecrementGaugeBoostCalldata(params), value: '0' },
    }
  }
}
