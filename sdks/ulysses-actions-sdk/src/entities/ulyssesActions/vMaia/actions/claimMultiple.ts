import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TClaimParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimMultipleAction class
 * @notice Provides a set of functions to encode calldata to Claim an amount of utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ClaimMultipleAction implements IAction<TClaimParams, IActionResult<void>> {
  params: TClaimParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ClaimMultipleAction class.
   * @param params the parameters for the Claim multiple action in the VoteMaia contract.
   * @returns a new instance of ClaimMultipleAction.
   * @notice the constructor is used to set the parameters for the Claim multiple action.
   */
  constructor(params: TClaimParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to Claim an amount of multiple of utility tokens into the VoteMaia contract.
   * @param params the parameters for the Claim multiple action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Claim multiple action.
   */
  public encode(params: TClaimParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeClaimMultipleCalldata(params), value: '0' },
    }
  }
}
