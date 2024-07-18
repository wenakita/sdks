import { NativeCurrency } from '../nativeCurrency'
import { NativeToken } from '../nativeToken'

/**
 * Represents a currency that's native to a given chain, either a native currency (gas token) or a token (regular ERC20)
 */
export type Currency = NativeCurrency | NativeToken
