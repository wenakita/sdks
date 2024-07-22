import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TClaimParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimGovernanceAction class
 * @notice Provides a set of functions to encode calldata to Claim an amount of Governance utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ClaimGovernanceAction implements IAction<TClaimParams, IActionResult<void>> {
  params: TClaimParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ClaimGovernanceAction class.
   * @param params the parameters for the Claim Governance action in the VoteMaia contract.
   * @returns a new instance of ClaimGovernanceAction.
   * @notice the constructor is used to set the parameters for the Claim Governance action.
   */
  constructor(params: TClaimParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to Claim Governance utility tokens into the VoteMaia contract.
   * @param params the parameters for the Claim Governance action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Claim Governance action.
   */
  public encode(params: TClaimParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeClaimGovernanceCalldata(params), value: '0' },
    }
  }
}
