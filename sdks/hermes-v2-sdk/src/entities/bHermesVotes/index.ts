import { Interface } from '@ethersproject/abi'
import JSBI from 'jsbi'
import { ZERO } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import BHermesVotesABI from '../../abis/bHermesVotes.json'
import { ADDRESS_ZERO } from '../../constants/constants'
import { TDelegateVotesParams, TUndelegateVotesParams } from '../../types/bHermesVotes'

/**
 * @title BHermesVotes class
 * @notice Provides a set of function to encode calldata for the different bHermes votes contract interactions.
 * @dev Actions such as delegating or undelegating governance power.
 * @author MaiaDAO
 */
export abstract class BHermesVotes {
  public static readonly INTERFACE: Interface = new Interface(BHermesVotesABI)

  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   *  Creates the necessary execution params to delegate bHermes governance power to a given address.
   * @param newDelegatee  The address of the gauge to delegate votes to
   */
  public static encodeDelegateCalldata({ newDelegatee }: TDelegateVotesParams): string {
    // Check if the new delegatee address is valid.
    invariant(newDelegatee, 'Invalid delegatee address')
    invariant(newDelegatee !== ADDRESS_ZERO, 'Invalid delegatee address can not be zero address')
    // Encode the delegate action.
    return BHermesVotes.INTERFACE.encodeFunctionData('delegate', [newDelegatee])
  }

  /**
   *  Creates the necessary execution params to undelegate bHermes governance power from a given address.
   * @param delegatee  The address of the gauge to undelegate votes from
   * @param amount  The amount of votes to undelegate
   */
  public static encodeUndelegateCalldata({ delegatee, amount }: TUndelegateVotesParams): string {
    // Check if the delegatee address and amount is valid.
    invariant(delegatee, 'Invalid delegatee address')
    invariant(delegatee !== ADDRESS_ZERO, 'Invalid delegatee address can not be zero address')
    invariant(JSBI.BigInt(amount) > ZERO, "Amount can't be negative or zero")
    // Encode the undelegate action.
    return BHermesVotes.INTERFACE.encodeFunctionData('undelegate', [delegatee, amount])
  }
}
