/**
 * Contains the parameters for the decrement all gauges boost action in bHermesBoost
 * @param boost the amount of boost to decrement the gauge by
 */
export type TDecrementAllGaugesBoostParams = {
  gauge: string
  boost: string
}

/**
 * Contains the parameters for the decrement gauge all boost action in bHermesBoost
 * @param gauge the gauge to decrement boost from
 */
export type TDecrementGaugeAllBoostParams = {
  gauge: string
}

/**
 * Contains the parameters for the decrement gauge boost action in bHermesBoost
 * @param gauge the gauge to decrement boost from
 * @param boost the amount of boost to decrement the gauge by
 */
export type TDecrementGaugeBoostParams = {
  gauge: string
  boost: string
}

/**
 * Contains the parameters for the decrement gauges boost indexed action in bHermesBoost
 * @param boost the total amount of boost to decrement from the gauges
 * @param offset the offset in the attached gauges list to start decrementing from
 * @param num the number of gauges to decrement boost from
 */
export type TDecrementGaugesBoostIndexedParams = {
  boost: string
  offset: number
  num: number
}
