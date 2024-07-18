/**
 * Contains the parameters for the decrement gauge action in bHermesGauges
 * @param pool the pool address for which gauge to decrement
 * @param amount the amount to decrement the gauge by
 */
export type TDecrementGaugeParams = {
  pool: string
  weight: string
}

/**
 * Contains the parameters for the decrement gauge action in bHermesGauges
 * @param pool the pool address for which gauge to decrement
 * @param amount the amount to decrement the gauge by
 */
export type TDecrementGaugesParams = {
  pools: string[]
  weights: string[]
}

/**
 * Contains the parameters for the delegate action in bHermesGauges
 * @param newDelegatee the address to delegate to
 */
export type TDelegateGaugeParams = {
  newDelegatee: string
}

/**
 * Contains the parameters for the increment gauge action in bHermesGauges
 * @param pool the pool address for which gauge to increment
 * @param amount the amount to increment the gauge by
 */
export type TIncrementGaugeParams = {
  pool: string
  weight: string
}

/**
 * Contains the parameters for the increment gauge action in bHermesGauges
 * @param pools the pool address for which gauge to increment
 * @param amount the amount to increment the gauge by
 */
export type TIncrementGaugesParams = {
  pools: string[]
  weights: string[]
}

/**
 * Contains the parameters for the undelegate action in bHermesGauges
 * @param delegatee the address to undelegate from
 * @param amount the amount to undelegate
 */
export type TUndelegateGaugeParams = {
  delegatee: string
  weight: string
}
