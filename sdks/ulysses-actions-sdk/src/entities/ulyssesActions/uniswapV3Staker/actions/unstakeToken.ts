import { TUnstakeTokenParams, UniswapV3Staker } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title UnstakeTokenAction class
 * @notice Provides a set of function to encode calldata for the unstake token action in UniswapV3Staker contract.
 * @author MaiaDAO
 */
export class UnstakeTokenAction implements IAction<TUnstakeTokenParams, IActionResult<void>> {
  params: TUnstakeTokenParams
  chainId?: SupportedChainId

  /**
   * Constructor for the UnstakeTokenAction class.
   * @param params the parameters for the unstake token action in UniswapV3Staker.
   * @returns a new instance of UnstakeTokenAction.
   * @notice the constructor is used to set the parameters for the unstake token action in UniswapV3Staker.
   */
  constructor(params: TUnstakeTokenParams, chainId?: SupportedChainId) {
    invariant(params.tokenId, 'Invalid tokenId')
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to increment a gauge in UniswapV3Staker.
   * @param params the parameters for the unstake token action in UniswapV3Staker.
   * @returns the target contract, encoded calldata and message value to send onchain for the unstake token action.
   */
  public encode(params: TUnstakeTokenParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.UniswapV3Staker ?? ZERO_ADDRESS,
      params: { calldata: UniswapV3Staker.encodeUnstakeTokenCalldata(params), value: '0' },
    }
  }
}
