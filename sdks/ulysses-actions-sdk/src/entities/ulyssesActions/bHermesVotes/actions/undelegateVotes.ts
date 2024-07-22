import { BHermesVotes, TUndelegateVotesParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title UndelegateAction class
 * @notice Provides a set of function to encode calldata for the undelegate action in bHermesVotes contract.
 * @author MaiaDAO
 */
export class UndelegateVotesAction implements IAction<TUndelegateVotesParams, IActionResult<void>> {
  params: TUndelegateVotesParams
  chainId?: SupportedChainId

  /**
   * Constructor for the UndelegateAction class.
   * @param params the parameters for the undelegate action in bHermesVotes.
   * @returns a new instance of UndelegateAction.
   * @notice the constructor is used to set the parameters for the undelegate action in bHermesVotes.
   */
  constructor(params: TUndelegateVotesParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to undelegate bHermesVotes.
   * @param params the parameters for the undelegate action in bHermesVotes.
   * @returns the target contract, encoded calldata and message value to send onchain for the undelegate action.
   */
  public encode(params: TUndelegateVotesParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesVotes ?? ZERO_ADDRESS,
      params: { calldata: BHermesVotes.encodeUndelegateCalldata(params), value: '0' },
    }
  }
}
