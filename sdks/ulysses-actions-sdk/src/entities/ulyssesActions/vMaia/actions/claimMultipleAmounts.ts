import { MaiaAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import { TClaimMultipleAmountsParams, VMaia } from 'maia-v2-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimMultipleAmountsAction class
 * @notice Provides a set of functions to encode calldata to Claim specific amounts of utility tokens back into the VoteMaia contract.
 * @author MaiaDAO
 */
export class ClaimMultipleAmountsAction implements IAction<TClaimMultipleAmountsParams, IActionResult<void>> {
  params: TClaimMultipleAmountsParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ClaimMultipleAmountsAction class.
   * @param params the parameters for the Claim multiple amounts action in the VoteMaia contract.
   * @returns a new instance of ClaimMultipleAmountsAction.
   * @notice the constructor is used to set the parameters for the Claim multiple amounts action.
   */
  constructor(params: TClaimMultipleAmountsParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to Claim multiple amouts of utiliuty tokens into the VoteMaia contract.
   * @param params the parameters for the Claim multiple amounts action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Claim multiple amounts action.
   */
  public encode(params: TClaimMultipleAmountsParams): IActionResult<IActionResult<void>> {
    return {
      target: MaiaAddresses[this.chainId ?? ROOT_CHAIN_ID]?.vMaia ?? ZERO_ADDRESS,
      params: { calldata: VMaia.encodeClaimMultipleAmountsCalldata(params), value: '0' },
    }
  }
}
