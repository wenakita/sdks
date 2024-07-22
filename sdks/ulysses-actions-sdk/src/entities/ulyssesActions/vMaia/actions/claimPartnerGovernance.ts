import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TClaimParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimPartnerGovernanceAction class
 * @notice Provides a set of functions to encode calldata to Claim an amount of Maia Governance utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ClaimPartnerGovernanceAction implements IAction<TClaimParams, IActionResult<void>> {
  params: TClaimParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ClaimPartnerGovernanceAction class.
   * @param params the parameters for the Claim Maia Governance action in the VoteMaia contract.
   * @returns a new instance of ClaimPartnerGovernanceAction.
   * @notice the constructor is used to set the parameters for the Claim PartnerGovernance action.
   */
  constructor(params: TClaimParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to Claim Maia Governance utility tokens into the VoteMaia contract.
   * @param params the parameters for the Claim Maia action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Claim Maia Governance action.
   */
  public encode(params: TClaimParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeClaimPartnerGovernanceCalldata(params), value: '0' },
    }
  }
}
