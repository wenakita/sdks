import { MaiaAddressesType } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

export const MaiaAddresses: MaiaAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: {
    Maia: '0x00000000702749f73E5210B08b0a3D440078f888',
    vMaia: '0x00003b020004328e005a0011b99a00c100cb9040',
    vMaiaVotes: '0x416fbdf56ce29f04d21c6f16eaba9b93c998b21e',
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
