import type { NativeToken } from 'maia-core-sdk'

import { GlobalToken } from '../globalToken'
import { LocalToken } from '../localToken'

// Represents any token in the omnichain system
export type UlyssesCurrency = GlobalToken | LocalToken | NativeToken
