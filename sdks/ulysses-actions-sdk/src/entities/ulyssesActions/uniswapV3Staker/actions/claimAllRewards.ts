import { TClaimAllRewardsParams, UniswapV3Staker } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title ClaimRewardAction class
 * @notice Provides a set of function to encode calldata for the claim all rewards action in UniswapV3Staker contract.
 * @author MaiaDAO
 */
export class ClaimAllRewardsAction implements IAction<TClaimAllRewardsParams, IActionResult<void>> {
  params: TClaimAllRewardsParams
  chainId?: SupportedChainId

  /**
   * Constructor for the ClaimRewardAction class.
   * @param params the parameters for the claim all rewards action in UniswapV3Staker.
   * @returns a new instance of ClaimRewardAction.
   * @notice the constructor is used to set the parameters for the claim all rewards action in UniswapV3Staker.
   */
  constructor(params: TClaimAllRewardsParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to increment a gauge in UniswapV3Staker.
   * @param params the parameters for the claim all rewards action in UniswapV3Staker.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim all rewards action.
   */
  public encode(params: TClaimAllRewardsParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.UniswapV3Staker ?? ZERO_ADDRESS,
      params: { calldata: UniswapV3Staker.encodeClaimAllRewardsCalldata(params), value: '0' },
    }
  }
}
