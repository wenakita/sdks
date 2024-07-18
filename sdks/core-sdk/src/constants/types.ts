import JSBI from 'jsbi'

/**
 * @name BigintIsh
 * @description
 * A type representing a bigint, a string, or a number. This is used for specifying the
 * amount of tokens, which can be specified as a normal number, a string, or a bigint.
 */
export type BigintIsh = JSBI | string | number

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

/**
 * @name AddressMap
 * @description
 * A type representing a map of chain IDs to addresses. This is used for specifying
 * the addresses for a protocol/token on different chains.
 */
export type AddressMap = { [chainId: number]: string }

/**
 * Return parameters of the create params functions
 */
export interface MethodReturnParams {
  calldata: string
  value: string
}
