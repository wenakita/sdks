import { BHermesVotes, TDelegateVotesParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DelegateAction class
 * @notice Provides a set of function to encode calldata for the delegate action in bHermesVotes contract.
 * @author MaiaDAO
 */
export class DelegateVotesAction implements IAction<TDelegateVotesParams, IActionResult<void>> {
  params: TDelegateVotesParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DelegateAction class.
   * @param params the parameters for the delegate action in bHermesVotes.
   * @returns a new instance of DelegateAction.
   * @notice the constructor is used to set the parameters for the delegate action in bHermesVotes.
   */
  constructor(params: TDelegateVotesParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to delegate bHermesVotes.
   * @param params the parameters for the delegate action in bHermesVotes.
   * @returns the target contract, encoded calldata and message value to send onchain for the delegate action.
   */
  public encode(params: TDelegateVotesParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermesVotes ?? ZERO_ADDRESS,
      params: { calldata: BHermesVotes.encodeDelegateCalldata(params), value: '0' },
    }
  }
}
