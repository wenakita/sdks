import { MaiaAddressesType } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

export const MaiaAddresses: MaiaAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: {
    Maia: ZERO_ADDRESS,
    vMaia: ZERO_ADDRESS,
    vMaiaVotes: ZERO_ADDRESS,
    vMaiaTest: ZERO_ADDRESS,
    vMaiaVotesTest: ZERO_ADDRESS,
  },
  [SupportedChainId.SEPOLIA]: {
    Maia: '0xe17F84cA0a338Bb09fe2FBF99DD841F2F5f6F8C2',
    vMaia: '0xa97B98B822A7fd1CaC21cCCa2E0Df99357C3dC75',
    vMaiaVotes: '0x4B620E248C2dB84186e7dd4dc17263b97b5eF34E',
    vMaiaTest: '0xC3667dC9f94BBD0643fB9c020865bE90713b0f4f',
    vMaiaVotesTest: '0x168f8c99291A9fEbB75EbBf5D3931CC995fF5D9b',
  },
}
