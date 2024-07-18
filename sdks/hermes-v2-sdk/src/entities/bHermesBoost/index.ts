import { Interface } from '@ethersproject/abi'
import JSBI from 'jsbi'
import { ZERO } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import BHermesBoostABI from '../../abis/bHermesBoost.json'
import { ADDRESS_ZERO } from '../../constants/constants'
import {
  TDecrementAllGaugesBoostParams,
  TDecrementGaugeAllBoostParams,
  TDecrementGaugeBoostParams,
  TDecrementGaugesBoostIndexedParams,
} from '../../types/bHermesBoost'

/**
 * @title BHermesBoost class
 * @notice Provides a set of function to encode calldata for the different bHermes gauges contract interactions.
 * @dev Actions such as incrementing or decrementing gauge vote allocations.
 * @author MaiaDAO
 */
export abstract class BHermesBoost {
  public static readonly INTERFACE: Interface = new Interface(BHermesBoostABI)

  /**
   * Cannot be constructed.
   */
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   * Creates the necessary execution params to decrement boost on a single gauge.
   * @param gauge  The address of the gauge to decrement boost from.
   * @param boost  The amount of boost to decrement.
   * @returns  The encoded decrement decrement gauge boost params.
   */
  public static encodeDecrementGaugeBoostCalldata({ gauge, boost }: TDecrementGaugeBoostParams): string {
    // Check if the gauge address and boost amount is valid.
    invariant(gauge, 'Invalid gauge address')
    invariant(gauge !== ADDRESS_ZERO, 'Invalid gauge address')
    invariant(JSBI.BigInt(boost) > ZERO, "Boost amount can't be negative or zero")
    // Encode the decrement gauge boost action.
    return BHermesBoost.INTERFACE.encodeFunctionData('decrementGaugeBoost', [gauge, boost])
  }

  /**
   * Creates the necessary execution params to decrement all boost on a single gauge.
   * @param gauge  The address of the gauge to decrement all boost from.
   * @returns  The encoded decrement all gauge boost params.
   */
  public static encodeDecrementGaugeAllBoostCalldata({ gauge }: TDecrementGaugeAllBoostParams): string {
    // Check if the gauge address is valid.
    invariant(gauge, 'Invalid gauge address')
    invariant(gauge !== ADDRESS_ZERO, 'Invalid gauge address')
    // Encode the decrement all gauge boost action.
    return BHermesBoost.INTERFACE.encodeFunctionData('decrementGaugeAllBoost', [gauge])
  }

  /**
   * Creates the necessary execution params to decrement boost from all gauges.
   * @param boost The amount of boost to detach.
   * @returns  The encoded decrement all gauge boost params.
   */
  public static encodeDecrementAllGaugesBoostCalldata({ boost }: TDecrementAllGaugesBoostParams): string {
    // Check if the boost amount is valid.
    invariant(JSBI.BigInt(boost) > ZERO, "Boost amount can't be negative or zero")
    // Encode the decrement all gauge boost action.
    return BHermesBoost.INTERFACE.encodeFunctionData('decrementAllGaugesBoost', [boost])
  }

  /**
   * Creates the necessary execution params to decrement boost from a subset of atached gauges, useful to prevent OUT_OF_GAS when many gauges are attached.
   * @param boost The amount of boost to detach.
   * @param offset The offset to start from.
   * @param num The number of gauges to detach boost from.
   * @returns  The encoded decrement all gauge boost params.
   */
  public static encodeDecrementGaugesBoostIndexedCalldata({
    boost,
    offset,
    num,
  }: TDecrementGaugesBoostIndexedParams): string {
    // Check if the boost, offset and num are valid.
    invariant(JSBI.BigInt(boost) > ZERO, "Boost amount can't be negative or zero")
    invariant(offset >= 0, "Offset can't be negative")
    invariant(num > 0, "Number of gauges can't be negative or zero")
    // Encode the decrement all gauge boost action.
    return BHermesBoost.INTERFACE.encodeFunctionData('decrementGaugesBoostIndexed', [boost, offset, num])
  }

  /**
   * Creates the necessary execution params to decrement all boost from all gauges.
   * @returns  The encoded decrement all gauge boost params.
   */
  public static encodeDecrementAllGaugesAllBoostCalldata(): string {
    return BHermesBoost.INTERFACE.encodeFunctionData('decrementAllGaugesAllBoost', [])
  }
}
