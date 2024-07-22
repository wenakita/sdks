import { BHermesGauges, TDecrementGaugesParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DecrementGaugesAction class
 * @notice Provides a set of function to encode calldata for the decrement gauges action in bHermesGauges contract.
 * @author MaiaDAO
 */
export class DecrementGaugesAction implements IAction<TDecrementGaugesParams, IActionResult<void>> {
  params: TDecrementGaugesParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DecrementGaugesAction class.
   * @param params the parameters for the decrement gauges action in bHermesGauges.
   * @returns a new instance of DecrementGaugesAction.
   * @notice the constructor is used to set the parameters for the decrement gauges action in bHermesGauges.
   */
  constructor(params: TDecrementGaugesParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to decrement multiple gauges in bHermesGauges.
   * @param params the parameters for the decrement gauges action in bHermesGauges.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauges action.
   */
  public encode(params: TDecrementGaugesParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesGauges ?? ZERO_ADDRESS,
      params: { calldata: BHermesGauges.encodeDecrementGaugesCalldata(params), value: '0' },
    }
  }
}
