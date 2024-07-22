import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TMintParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title MintAction class
 * @notice Provides a set of functions to encode calldata to mint $vMaia for $Maia using VoteMaia contract.
 * @author MaiaDAO
 */
export class MintAction implements IAction<TMintParams, IActionResult<void>> {
  params: TMintParams
  chainId?: SupportedChainId

  /**
   * Constructor for the MintAction class.
   * @param params the parameters for the mint action in the VoteMaia contract.
   * @returns a new instance of MintAction.
   * @notice the constructor is used to set the parameters for the mint Maia action.
   */
  constructor(params: TMintParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to mint $Maia in exchange for $vMaia.
   * @param params the parameters for the mint Maia action.
   * @returns the target contract, encoded calldata and message value to send onchain for the mint Maia action.
   */
  public encode(params: TMintParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeMintCalldata(params), value: '0' },
    }
  }
}
