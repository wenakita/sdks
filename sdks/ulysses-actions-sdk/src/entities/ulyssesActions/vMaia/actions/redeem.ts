import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TRedeemParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title RedeemAction class
 * @notice Provides a set of functions to encode calldata to redeem $Maia for $vMaia using VoteMaia contract.
 * @author MaiaDAO
 */
export class RedeemAction implements IAction<TRedeemParams, IActionResult<void>> {
  params: TRedeemParams
  chainId?: SupportedChainId

  /**
   * Constructor for the RedeemAction class.
   * @param params the parameters for the redeem action in the VoteMaia contract.
   * @returns a new instance of RedeemAction.
   * @notice the constructor is used to set the parameters for the redeem $vMaia action.
   */
  constructor(params: TRedeemParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to redeem $vMaia in exchange $Maia.
   * @param params the parameters for the redeem vMaia action.
   * @returns the target contract, encoded calldata and message value to send onchain for the redeem vMaia action.
   */
  public encode(params: TRedeemParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeMintCalldata(params), value: '0' },
    }
  }
}
