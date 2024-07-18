import { BaseCurrency } from '../baseCurrency'

/**
 * Represents the native currency of the chain on which it resides, e.g. eth on Mainnet
 */
export abstract class NativeCurrency extends BaseCurrency {
  public readonly isNative: true = true as const
  public readonly isToken: false = false as const
}
