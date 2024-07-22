import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TForfeitParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ForfeitMultipleAction class
 * @notice Provides a set of functions to encode calldata to forfeit an amount of utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ForfeitMultipleAction implements IAction<TForfeitParams, IActionResult<void>> {
  params: TForfeitParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ForfeitMultipleAction class.
   * @param params the parameters for the forfeit multiple action in the VoteMaia contract.
   * @returns a new instance of ForfeitMultipleAction.
   * @notice the constructor is used to set the parameters for the forfeit multiple action.
   */
  constructor(params: TForfeitParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to forfeit an amount of multiple of utility tokens into the VoteMaia contract.
   * @param params the parameters for the forfeit multiple action.
   * @returns the target contract, encoded calldata and message value to send onchain for the forfeit multiple action.
   */
  public encode(params: TForfeitParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeForfeitMultipleCalldata(params), value: '0' },
    }
  }
}
