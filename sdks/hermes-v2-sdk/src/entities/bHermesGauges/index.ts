import { Interface } from '@ethersproject/abi'
import JSBI from 'jsbi'
import { ZERO, ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import BHermesGaugesABI from '../../abis/bHermesGauges.json'
import {
  TDecrementGaugeParams,
  TDecrementGaugesParams,
  TDelegateGaugeParams,
  TIncrementGaugeParams,
  TIncrementGaugesParams,
  TUndelegateGaugeParams,
} from '../../types/bHermesGauges'

/**
 * @title BHermesGauges class
 * @notice Provides a set of function to encode calldata for the different bHermes gauges contract interactions.
 * @dev Actions such as incrementing or decrementing gauge vote allocations.
 * @author MaiaDAO
 */
export abstract class BHermesGauges {
  public static readonly INTERFACE: Interface = new Interface(BHermesGaugesABI)

  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   *  Creates the necessary execution params to increment weight on a single gauge.
   * @param pool  The address of the pool for which gauge to increment weight
   * @param weight  The amount of weight to increment
   * @returns  The encoded increment gauge votes params
   */
  public static encodeIncrementGaugeCalldata({ pool, weight }: TIncrementGaugeParams): string {
    invariant(pool, 'Invalid pool')
    invariant(pool !== ZERO_ADDRESS, 'Invalid pool')
    invariant(JSBI.BigInt(weight) >= ZERO, 'Invalid votes')
    return BHermesGauges.INTERFACE.encodeFunctionData('incrementGauge', [pool, weight])
  }

  /**
   *  Creates the necessary execution params to increment weight on multiple gauges.
   * @param pools  array of uniswap V3 pool addresses
   * @param weights  array of weight to be incremented
   * @returns  The encoded increment gauges params
   */
  public static encodeIncrementGaugesCalldata({ pools, weights }: TIncrementGaugesParams): string {
    invariant(pools, 'Invalid address')
    invariant(
      pools.every((pool) => pool !== ZERO_ADDRESS),
      'Invalid address cant be zero'
    )
    invariant(weights, 'Invalid votes')
    invariant(
      weights.every((weight) => JSBI.BigInt(weight) > ZERO),
      'Invalid votes cant be zero'
    )

    return BHermesGauges.INTERFACE.encodeFunctionData('incrementGauges', [pools, weights])
  }

  /**
   *  Creates the necessary execution params to decrement votes on a given gauge.
   * @param pool  The address of the pool for which gauge to decrement weight from
   * @param weight  The amount of weight to decrement
   * @returns  The encoded decrement gauge votes params
   */
  public static encodeDecrementGaugeCalldata({ pool, weight }: TDecrementGaugeParams): string {
    invariant(pool, 'Invalid pool')
    invariant(pool !== ZERO_ADDRESS, 'Invalid pool')
    invariant(JSBI.BigInt(weight) >= ZERO, 'Invalid votes')
    return BHermesGauges.INTERFACE.encodeFunctionData('decrementGauge', [pool, weight])
  }

  /**
   *  Creates the necessary execution params to decrement votes on multiple gauges.
   * @param pools  array of uniswap V3 pool addresses
   * @param weights  array of amount of weight to be decremented
   * @returns  The encoded decrement gauges params
   */
  public static encodeDecrementGaugesCalldata({ pools, weights }: TDecrementGaugesParams): string {
    invariant(pools, 'Invalid address')
    invariant(
      pools.every((pool) => pool !== ZERO_ADDRESS),
      'Invalid address cant be zero'
    )
    invariant(weights, 'Invalid votes')
    invariant(
      weights.every((weight) => JSBI.BigInt(weight) > ZERO),
      'Invalid votes cant be zero'
    )
    return BHermesGauges.INTERFACE.encodeFunctionData('decrementGauges', [pools, weights])
  }

  /**
   *  Creates the necessary execution params to delegate bHermes gauge weight to a given address.
   * @param newDelegatee  The address of the gauge to delegate votes to
   */
  public static encodeDelegateCalldata({ newDelegatee }: TDelegateGaugeParams): string {
    invariant(newDelegatee, 'Invalid address')
    invariant(newDelegatee !== ZERO_ADDRESS, 'Invalid address cant be zero')
    return BHermesGauges.INTERFACE.encodeFunctionData('delegate', [newDelegatee])
  }

  /**
   *  Creates the necessary execution params to undelegate bHermes gauge weight from a given address.
   * @param delegatee  The address of the gauge to undelegate votes from
   * @param weight  The amount of gauge weight to undelegate
   */
  public static encodeUndelegateCalldata({ delegatee, weight }: TUndelegateGaugeParams): string {
    invariant(delegatee, 'Invalid address')
    invariant(delegatee !== ZERO_ADDRESS, 'Invalid address cant be zero')
    return BHermesGauges.INTERFACE.encodeFunctionData('undelegate', [delegatee, weight])
  }
}
