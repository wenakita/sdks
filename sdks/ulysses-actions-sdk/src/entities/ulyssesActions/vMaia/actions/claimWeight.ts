import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TClaimParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimWeightAction class
 * @notice Provides a set of functions to encode calldata to Claim an amount of weight utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ClaimWeightAction implements IAction<TClaimParams, IActionResult<void>> {
  params: TClaimParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ClaimWeightAction class.
   * @param params the parameters for the Claim weight action in the VoteMaia contract.
   * @returns a new instance of ClaimWeightAction.
   * @notice the constructor is used to set the parameters for the Claim weight action.
   */
  constructor(params: TClaimParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to Claim weight utility tokens into the VoteMaia contract.
   * @param params the parameters for the Claim weight action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Claim weight action.
   */
  public encode(params: TClaimParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeClaimWeightCalldata(params), value: '0' },
    }
  }
}
