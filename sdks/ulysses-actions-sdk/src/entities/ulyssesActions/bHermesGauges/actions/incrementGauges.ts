import { BHermesGauges, TIncrementGaugesParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title IncrementGaugesAction class
 * @notice Provides a set of function to encode calldata for the increment gauges action in bHermesGauges contract.
 * @author MaiaDAO
 */
export class IncrementGaugesAction implements IAction<TIncrementGaugesParams, IActionResult<void>> {
  params: TIncrementGaugesParams
  chainId?: SupportedChainId

  /**
   * Constructor for the IncrementGaugesAction class.
   * @param params the parameters for the increment gauges action in bHermesGauges.
   * @returns a new instance of IncrementGaugesAction.
   * @notice the constructor is used to set the parameters for the increment gauges action in bHermesGauges.
   */
  constructor(params: TIncrementGaugesParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to increment multiple gauges in bHermesGauges.
   * @param params the parameters for the increment gauges action in bHermesGauges.
   * @returns the target contract, encoded calldata and message value to send onchain for the increment gauges action.
   */
  public encode(params: TIncrementGaugesParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesGauges ?? ZERO_ADDRESS,
      params: { calldata: BHermesGauges.encodeIncrementGaugesCalldata(params), value: '0' },
    }
  }
}
