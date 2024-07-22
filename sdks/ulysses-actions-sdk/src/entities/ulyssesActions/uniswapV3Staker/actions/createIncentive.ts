import { TCreateIncentiveParams, UniswapV3Staker } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title CreateIncentiveAction class
 * @notice Provides a set of function to encode calldata for the create incentive action in UniswapV3Staker contract.
 * @author MaiaDAO
 */
export class CreateIncentiveAction implements IAction<TCreateIncentiveParams, IActionResult<void>> {
  params: TCreateIncentiveParams
  chainId?: SupportedChainId

  /**
   * Constructor for the CreateIncentiveAction class.
   * @param params the parameters for the create incentive action in UniswapV3Staker.
   * @returns a new instance of CreateIncentiveAction.
   * @notice the constructor is used to set the parameters for the create incentive action in UniswapV3Staker.
   */
  constructor(params: TCreateIncentiveParams, chainId?: SupportedChainId) {
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to increment a gauge in UniswapV3Staker.
   * @param params the parameters for the create incentive action in UniswapV3Staker.
   * @returns the target contract, encoded calldata and message value to send onchain for the create incentive action.
   */
  public encode(params: TCreateIncentiveParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.UniswapV3Staker ?? ZERO_ADDRESS,
      params: {
        calldata: UniswapV3Staker.encodeCreateIncentiveCalldata(params),
        value: '0',
      },
    }
  }
}
