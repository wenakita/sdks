import { defaultAbiCoder, Interface } from '@ethersproject/abi'
import IUniswapV3Staker from '@uniswap/v3-staker/artifacts/contracts/UniswapV3Staker.sol/UniswapV3Staker.json'
import { MethodParameters, toHex } from 'maia-core-sdk'

import { ClaimOptions, FullWithdrawOptions, IncentiveKey } from '../../types/staker'
import { validateAndParseAddress } from '../../utils/addresses/validateAndParseAddress'
import { Multicall } from '../multicall'
import { Pool } from '../pool'

export abstract class Staker {
  public static readonly INTERFACE: Interface = new Interface(IUniswapV3Staker.abi)

  protected constructor() {}
  private static INCENTIVE_KEY_ABI =
    'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)'

  /**
   *  To claim rewards, must unstake and then claim.
   * @param incentiveKey The unique identifier of a staking program.
   * @param options Options for producing the calldata to claim. Can't claim unless you unstake.
   * @returns The calldatas for 'unstakeToken' and 'claimReward'.
   */
  private static encodeClaim(incentiveKey: IncentiveKey, options: ClaimOptions): string[] {
    const calldatas: string[] = []
    calldatas.push(
      Staker.INTERFACE.encodeFunctionData('unstakeToken', [
        this._encodeIncentiveKey(incentiveKey),
        toHex(options.tokenId),
      ])
    )
    const recipient: string = validateAndParseAddress(options.recipient)
    const amount = options.amount ?? 0
    calldatas.push(
      Staker.INTERFACE.encodeFunctionData('claimReward', [incentiveKey.rewardToken.address, recipient, toHex(amount)])
    )
    return calldatas
  }

  /**
   *
   * Note:  A `tokenId` can be staked in many programs but to claim rewards and continue the program you must unstake, claim, and then restake.
   * @param incentiveKeys An IncentiveKey or array of IncentiveKeys that `tokenId` is staked in.
   * Input an array of IncentiveKeys to claim rewards for each program.
   * @param options ClaimOptions to specify tokenId, recipient, and amount wanting to collect.
   * Note that you can only specify one amount and one recipient across the various programs if you are collecting from multiple programs at once.
   * @returns
   */
  public static collectRewards(incentiveKeys: IncentiveKey | IncentiveKey[], options: ClaimOptions): MethodParameters {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys]
    let calldatas: string[] = []

    for (const element of incentiveKeys) {
      // the unique program tokenId is staked in
      const incentiveKey = element
      // unstakes and claims for the unique program
      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, options))
      // re-stakes the position for the unique program
      calldatas.push(
        Staker.INTERFACE.encodeFunctionData('stakeToken', [
          this._encodeIncentiveKey(incentiveKey),
          toHex(options.tokenId),
        ])
      )
    }
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  /**
   *
   * @param incentiveKeys A list of incentiveKeys to unstake from. Should include all incentiveKeys (unique staking programs) that `options.tokenId` is staked in.
   * @param withdrawOptions Options for producing claim calldata and withdraw calldata. Can't withdraw without unstaking all programs for `tokenId`.
   * @returns Calldata for unstaking, claiming, and withdrawing.
   */
  public static withdrawToken(
    incentiveKeys: IncentiveKey | IncentiveKey[],
    withdrawOptions: FullWithdrawOptions
  ): MethodParameters {
    let calldatas: string[] = []

    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys]

    const claimOptions = {
      tokenId: withdrawOptions.tokenId,
      recipient: withdrawOptions.recipient,
      amount: withdrawOptions.amount,
    }

    for (const element of incentiveKeys) {
      const incentiveKey = element
      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, claimOptions))
    }
    const owner = validateAndParseAddress(withdrawOptions.owner)
    calldatas.push(
      Staker.INTERFACE.encodeFunctionData('withdrawToken', [
        toHex(withdrawOptions.tokenId),
        owner,
        withdrawOptions.data ? withdrawOptions.data : toHex(0),
      ])
    )
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  /**
   *
   * @param incentiveKeys A single IncentiveKey or array of IncentiveKeys to be encoded and used in the data parameter in `safeTransferFrom`
   * @returns An IncentiveKey as a string
   */
  public static encodeDeposit(incentiveKeys: IncentiveKey | IncentiveKey[]): string {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys]
    let data: string

    if (incentiveKeys.length > 1) {
      const keys = []
      for (const element of incentiveKeys) {
        const incentiveKey = element
        keys.push(this._encodeIncentiveKey(incentiveKey))
      }
      data = defaultAbiCoder.encode([`${Staker.INCENTIVE_KEY_ABI}[]`], [keys])
    } else {
      data = defaultAbiCoder.encode([Staker.INCENTIVE_KEY_ABI], [this._encodeIncentiveKey(incentiveKeys[0])])
    }
    return data
  }
  /**
   *
   * @param incentiveKey An `IncentiveKey` which represents a unique staking program.
   * @returns An encoded IncentiveKey to be read by ethers
   */
  private static _encodeIncentiveKey(incentiveKey: IncentiveKey): object {
    const { token0, token1, fee } = incentiveKey.pool
    const refundee = validateAndParseAddress(incentiveKey.refundee)
    return {
      rewardToken: incentiveKey.rewardToken.address,
      pool: Pool.getAddress(token0, token1, fee),
      startTime: toHex(incentiveKey.startTime),
      endTime: toHex(incentiveKey.endTime),
      refundee,
    }
  }
}
