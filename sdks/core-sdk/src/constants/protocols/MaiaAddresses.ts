import { MaiaAddressesType } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

export const MaiaAddresses: MaiaAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: {
    Maia: '0x00000000ea00F3F4000e7Ed5Ed91965b19f1009B',
    vMaia: '0x000000f0C01c6200354f240000b7003668B4D080',
    vMaiaVotes: '0x54b6e28a869a56f4e34d1187ae0a35b7dd3be111',
    vMaiaTest: ZERO_ADDRESS,
    vMaiaVotesTest: ZERO_ADDRESS,
  },
  [SupportedChainId.SEPOLIA]: {
    Maia: '0x8dFe092C40F6AE7081bb6f920E899BD640812c15',
    vMaia: '0x3e822a168A667AbA3e6C6e7B64B562ecbD20C45b',
    vMaiaVotes: '0xA3276039F58C3b6FDA367c96d3EfeE6d84487547',
    vMaiaTest: '0xF9Af8CF1EfA09946634E6a1Cf3dCF616e3D23642',
    vMaiaVotesTest: '0x1e6a18b3d17b4d4f149DeDCDd0A89D8803048649',
  },
}
