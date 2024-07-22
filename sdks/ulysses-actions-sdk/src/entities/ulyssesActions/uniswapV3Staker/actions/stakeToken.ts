import { TStakeTokenParams, UniswapV3Staker } from 'hermes-v2-sdk'
import { HermesAddresses, ROOT_CHAIN_ID, SupportedChainId, ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { IAction, IActionResult } from '../../../../utils/action'

/**
 * @title stakeTokenAction class
 * @notice Provides a set of function to encode calldata for the stake token action in UniswapV3Staker contract.
 * @author MaiaDAO
 */
export class StakeTokenAction implements IAction<TStakeTokenParams, IActionResult<void>> {
  params: TStakeTokenParams
  chainId?: SupportedChainId

  /**
   * Constructor for the stakeTokenAction class.
   * @param params the parameters for the stake token action in UniswapV3Staker.
   * @returns a new instance of stakeTokenAction.
   * @notice the constructor is used to set the parameters for the stake token action in UniswapV3Staker.
   */
  constructor(params: TStakeTokenParams, chainId?: SupportedChainId) {
    invariant(params.tokenId, 'Invalid tokenId')
    this.params = params
    this.chainId = chainId
  }

  /**
   * Encodes the contract interaction calldata to increment a gauge in UniswapV3Staker.
   * @param params the parameters for the stake token action in UniswapV3Staker.
   * @returns the target contract, encoded calldata and message value to send onchain for the stake token action.
   */
  public encode(params: TStakeTokenParams): IActionResult<IActionResult<void>> {
    return {
      target: HermesAddresses[this.chainId ?? ROOT_CHAIN_ID]?.UniswapV3Staker ?? ZERO_ADDRESS,
      params: { calldata: UniswapV3Staker.encodeStakeTokenCalldata(params), value: '0' },
    }
  }
}
