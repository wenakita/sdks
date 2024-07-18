import { MaiaAddressesType } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

export const MaiaAddresses: MaiaAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: {
    Maia: ZERO_ADDRESS,
    vMaia: ZERO_ADDRESS,
    vMaiaVotes: ZERO_ADDRESS,
  },
  [SupportedChainId.SEPOLIA]: {
    Maia: '0x1877F4644eEC61659d7fa40F297f20507b60f75e',
    vMaia: '0x2bc7a31E13B78f37371793dE7629AEC39465E976',
    vMaiaVotes: '0x5EA25810EbeD7bcCf4045ed2eF14192DEc79C79f',
  },
}
