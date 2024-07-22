import { BHermesBoost } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DecrementAllGaugesAllBoostAction class
 * @notice Provides a set of function to encode calldata for the decrement all gauge all boost action in bHermesBoost contract.
 * @author MaiaDAO
 */
export class DecrementAllGaugesAllBoostAction implements IAction<any, IActionResult<void>> {
  params: any
  chainId?: SupportedChainId

  /**
   * Constructor for the DecrementAllGaugesAllBoostAction class.
   * @returns a new instance of DecrementAllGaugesAllBoostAction.
   * @notice the constructor is used to set the parameters for the decrement all gauge all boost action in bHermesBoost.
   */
  constructor(params: any, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to decrement all boost from all attached gauges in bHermesBoost.
   * @param _params no parameters required, input is ignored.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement all gauge all boost action.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public encode(_params: any): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesBoost ?? ZERO_ADDRESS,
      params: { calldata: BHermesBoost.encodeDecrementAllGaugesAllBoostCalldata(), value: '0' },
    }
  }
}
