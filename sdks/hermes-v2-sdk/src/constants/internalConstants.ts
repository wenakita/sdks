import JSBI from 'jsbi'

// used in liquidity amount math
export const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96))
export const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2))

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)
