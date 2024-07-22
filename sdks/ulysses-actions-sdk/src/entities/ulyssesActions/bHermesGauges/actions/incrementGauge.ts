import { BHermesGauges, TIncrementGaugeParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title IncrementGaugeAction class
 * @notice Provides a set of function to encode calldata for the increment gauge action in bHermesGauges contract.
 * @author MaiaDAO
 */
export class IncrementGaugeAction implements IAction<TIncrementGaugeParams, IActionResult<void>> {
  params: TIncrementGaugeParams
  chainId?: SupportedChainId

  /**
   * Constructor for the IncrementGaugeAction class.
   * @param params the parameters for the increment gauge action in bHermesGauges.
   * @returns a new instance of IncrementGaugeAction.
   * @notice the constructor is used to set the parameters for the increment gauge action in bHermesGauges.
   */
  constructor(params: TIncrementGaugeParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to increment a gauge in bHermesGauges.
   * @param params the parameters for the increment gauge action in bHermesGauges.
   * @returns the target contract, encoded calldata and message value to send onchain for the increment gauge action.
   */
  public encode(params: TIncrementGaugeParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesGauges ?? ZERO_ADDRESS,
      params: { calldata: BHermesGauges.encodeIncrementGaugeCalldata(params), value: '0' },
    }
  }
}
