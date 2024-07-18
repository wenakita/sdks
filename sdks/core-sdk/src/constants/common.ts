import JSBI from 'jsbi'

//Max Uint256
export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// constants used internally but not expected to be used externally
export const NEGATIVE_ONE = JSBI.BigInt(-1)
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const ONE_18 = JSBI.BigInt('1000000000000000000') // 18 decimal places
export const FIVE = JSBI.BigInt(5)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

/**
 * Represents the fee amount in bips for the pools.
 * @param LOWEST - The lowest fee amount in bips. 100 bips = 0.01%.
 * @param LOW - The low fee amount in bips. 500 bips = 0.05%.
 * @param MEDIUM - The medium fee amount in bips. 3000 bips = 0.3%.
 * @param HIGH - The high fee amount in bips. 10000 bips = 1%.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}
