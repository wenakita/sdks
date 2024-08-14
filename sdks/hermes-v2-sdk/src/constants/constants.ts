import { ZERO_ADDRESS } from 'maia-core-sdk'

export const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const BALANCER_VAULT_ADDRESS = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'

export const ADDRESS_ZERO = ZERO_ADDRESS

export const MAX_RANGE = 2 ** 256
export const TICK_INCREMENT = 0.0001
export const YEAR = 31536000

export const POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'

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

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
}

// exports for external consumption

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}
