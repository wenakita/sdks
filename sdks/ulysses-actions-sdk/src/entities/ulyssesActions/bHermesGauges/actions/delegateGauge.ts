import { BHermesGauges, TDelegateGaugeParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DelegateAction class
 * @notice Provides a set of function to encode calldata for the delegate action in bHermesGauges contract.
 * @author MaiaDAO
 */
export class DelegateGaugeAction implements IAction<TDelegateGaugeParams, IActionResult<void>> {
  params: TDelegateGaugeParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DelegateAction class.
   * @param params the parameters for the delegate action in bHermesGauges.
   * @returns a new instance of DelegateAction.
   * @notice the constructor is used to set the parameters for the delegate action in bHermesGauges.
   */
  constructor(params: TDelegateGaugeParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to delegate bHermesGauges.
   * @param params the parameters for the delegate action in bHermesGauges.
   * @returns the target contract, encoded calldata and message value to send onchain for the delegate action.
   */
  public encode(params: TDelegateGaugeParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesGauges ?? ZERO_ADDRESS,
      params: { calldata: BHermesGauges.encodeDelegateCalldata(params), value: '0' },
    }
  }
}
