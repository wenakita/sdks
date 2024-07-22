import { BHermes, TBurnHermesParams } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title BurnHermesAction class
 * @notice Provides a set of function to encode calldata for the burn action in bHermes contract.
 * @author MaiaDAO
 */
export class BurnHermesAction implements IAction<TBurnHermesParams, IActionResult<void>> {
  params: TBurnHermesParams
  chainId?: SupportedChainId

  /**
   * Constructor for the BurnHermesAction class.
   * @param params the parameters for the burn action in bHermes.
   * @returns a new instance of BurnHermesAction.
   * @notice the constructor is used to set the parameters for the burn action in bHermes.
   */
  constructor(params: TBurnHermesParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to burn $Hermes in exchange for $bHermes.
   * @param params the parameters for the burn action in bHermes.
   * @returns the target contract, encoded calldata and message value to send to Branch Router for the burn action.
   */
  public encode(params: TBurnHermesParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.bHermes ?? ZERO_ADDRESS,
      params: { calldata: BHermes.encodeBurnCalldata(params), value: '0' },
    }
  }
}
