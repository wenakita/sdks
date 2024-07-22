import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TForfeitParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ForfeitGovernanceAction class
 * @notice Provides a set of functions to encode calldata to forfeit an amount of Governance utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ForfeitGovernanceAction implements IAction<TForfeitParams, IActionResult<void>> {
  params: TForfeitParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ForfeitGovernanceAction class.
   * @param params the parameters for the forfeit Governance action in the VoteMaia contract.
   * @returns a new instance of ForfeitGovernanceAction.
   * @notice the constructor is used to set the parameters for the forfeit Governance action.
   */
  constructor(params: TForfeitParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to forfeit Governance utility tokens into the VoteMaia contract.
   * @param params the parameters for the forfeit Governance action.
   * @returns the target contract, encoded calldata and message value to send onchain for the forfeit Governance action.
   */
  public encode(params: TForfeitParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeForfeitGovernanceCalldata(params), value: '0' },
    }
  }
}
