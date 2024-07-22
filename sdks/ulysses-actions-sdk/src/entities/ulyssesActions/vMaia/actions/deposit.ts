import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TDepositParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title DepositAction class
 * @notice Provides a set of functions to encode calldata to deposit $Maia for $vMaia using VoteMaia contract.
 * @author MaiaDAO
 */
export class DepositAction implements IAction<TDepositParams, IActionResult<void>> {
  params: TDepositParams
  chainId?: SupportedChainId

  /**
   * Constructor for the DepositAction class.
   * @param params the parameters for the deposit action in the VoteMaia contract.
   * @returns a new instance of DepositAction.
   * @notice the constructor is used to set the parameters for the deposit Maia action.
   */
  constructor(params: TDepositParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to deposit $Maia in exchange for $vMaia.
   * @param params the parameters for the deposit Maia action.
   * @returns the target contract, encoded calldata and message value to send onchain for the deposit Maia action.
   */
  public encode(params: TDepositParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeDepositCalldata(params), value: '0' },
    }
  }
}
