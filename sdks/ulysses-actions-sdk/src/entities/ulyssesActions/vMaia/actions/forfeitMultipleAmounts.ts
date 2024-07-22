import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TForfeitMultipleAmountsParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ForfeitMultipleAmountsAction class
 * @notice Provides a set of functions to encode calldata to forfeit specific amounts of utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ForfeitMultipleAmountsAction implements IAction<TForfeitMultipleAmountsParams, IActionResult<void>> {
  params: TForfeitMultipleAmountsParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ForfeitMultipleAmountsAction class.
   * @param params the parameters for the forfeit multiple amounts action in the VoteMaia contract.
   * @returns a new instance of ForfeitMultipleAmountsAction.
   * @notice the constructor is used to set the parameters for the forfeit multiple amounts action.
   */
  constructor(params: TForfeitMultipleAmountsParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to forfeit multiple amouts of utiliuty tokens into the VoteMaia contract.
   * @param params the parameters for the forfeit multiple amounts action.
   * @returns the target contract, encoded calldata and message value to send onchain for the forfeit multiple amounts action.
   */
  public encode(params: TForfeitMultipleAmountsParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeForfeitMultipleAmountsCalldata(params), value: '0' },
    }
  }
}
