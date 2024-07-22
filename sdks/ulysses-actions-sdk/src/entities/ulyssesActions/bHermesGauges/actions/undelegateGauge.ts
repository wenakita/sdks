import { BHermesGauges, TUndelegateGaugeParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title UndelegateAction class
 * @notice Provides a set of function to encode calldata for the undelegate action in bHermesGauges contract.
 * @author MaiaDAO
 */
export class UndelegateGaugeAction implements IAction<TUndelegateGaugeParams, IActionResult<void>> {
  params: TUndelegateGaugeParams
  chainId?: SupportedChainId

  /**
   * Constructor for the UndelegateAction class.
   * @param params the parameters for the undelegate action in bHermesGauges.
   * @returns a new instance of UndelegateAction.
   * @notice the constructor is used to set the parameters for the undelegate action in bHermesGauges.
   */
  constructor(params: TUndelegateGaugeParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to undelegate bHermesGauges.
   * @param params the parameters for the undelegate action in bHermesGauges.
   * @returns the target contract, encoded calldata and message value to send onchain for the undelegate action.
   */
  public encode(params: TUndelegateGaugeParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesGauges ?? ZERO_ADDRESS,
      params: { calldata: BHermesGauges.encodeUndelegateCalldata(params), value: '0' },
    }
  }
}
