import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TWithdrawParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title WithdrawAction class
 * @notice Provides a set of functions to encode calldata to withdraw $Maia for $vMaia using VoteMaia contract.
 * @author MaiaDAO
 */
export class WithdrawAction implements IAction<TWithdrawParams, IActionResult<void>> {
  params: TWithdrawParams
  chainId?: SupportedChainId

  /**
   * Constructor for the WithdrawAction class.
   * @param params the parameters for the withdraw action in the VoteMaia contract.
   * @returns a new instance of WithdrawAction.
   * @notice the constructor is used to set the parameters for the withdraw Maia action.
   */
  constructor(params: TWithdrawParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to withdraw $Maia in exchange for $vMaia.
   * @param params the parameters for the withdraw Maia action.
   * @returns the target contract, encoded calldata and message value to send onchain for the withdraw Maia action.
   */
  public encode(params: TWithdrawParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeWithdrawCalldata(params), value: '0' },
    }
  }
}
