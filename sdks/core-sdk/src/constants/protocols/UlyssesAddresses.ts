import { IUlysses, IUlyssesArbitrumContracts, IUlyssesCommonContracts } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

// MAINNET - Ulysses Omnichain Address Definitions per Chain

const UlyssesArbitrumBranch: IUlyssesCommonContracts = {
  BranchPort: ZERO_ADDRESS,
  BranchBridgeAgentFactory: ZERO_ADDRESS,
  CoreBranchRouter: ZERO_ADDRESS,
  CoreBranchBridgeAgent: ZERO_ADDRESS,
  ERC20hTokenBranchFactory: ZERO_ADDRESS,
  MulticallBranchRouter: ZERO_ADDRESS,
  MulticallBranchBridgeAgent: ZERO_ADDRESS,
  MulticallBranchRouterLibZip: ZERO_ADDRESS,
  MulticallBranchBridgeAgentLibZip: ZERO_ADDRESS,
  NativeToken: ZERO_ADDRESS,
}

const UlyssesArbitrum: IUlyssesArbitrumContracts = {
  ...UlyssesArbitrumBranch,
  RootPort: ZERO_ADDRESS,
  RootBridgeAgentFactory: ZERO_ADDRESS,
  CoreRootRouter: ZERO_ADDRESS,
  CoreRootBridgeAgent: ZERO_ADDRESS,
  ERC20hTokenRootFactory: ZERO_ADDRESS,
  MulticallRootRouter: ZERO_ADDRESS,
  MulticallRootBridgeAgent: ZERO_ADDRESS,
  MulticallRootRouterLibZip: ZERO_ADDRESS,
  MulticallRootBridgeAgentLibZip: ZERO_ADDRESS,
}

const UlyssesEthereum: IUlyssesCommonContracts = {
  BranchPort: ZERO_ADDRESS,
  BranchBridgeAgentFactory: ZERO_ADDRESS,
  CoreBranchRouter: ZERO_ADDRESS,
  CoreBranchBridgeAgent: ZERO_ADDRESS,
  ERC20hTokenBranchFactory: ZERO_ADDRESS,
  MulticallBranchRouter: ZERO_ADDRESS,
  MulticallBranchBridgeAgent: ZERO_ADDRESS,
  MulticallBranchRouterLibZip: ZERO_ADDRESS,
  MulticallBranchBridgeAgentLibZip: ZERO_ADDRESS,
  NativeToken: ZERO_ADDRESS,
}

// TESTNET - Ulysses Omnichain Address Definitions per Chain

const UlyssesSepoliaBranch: IUlyssesCommonContracts = {
  BranchPort: '0xE2B6Dc3e16873aC460d01307898eba5e3ef72165',
  BranchBridgeAgentFactory: '0xbDf7Df30b8575a112cA8B74486f616f97548573C',
  CoreBranchRouter: '0xE9E180453f1318c9518166f53BF5b55Cfb5302Cf',
  CoreBranchBridgeAgent: 'ZERO_ADDRESS', // TODO: Update - not used for now
  ERC20hTokenBranchFactory: ZERO_ADDRESS,
  MulticallBranchRouter: '0x9FF07935Aa66aCCEc439a7bc830645B77198E2CF',
  MulticallBranchBridgeAgent: 'ZERO_ADDRESS', // TODO: Update - not used for now
  MulticallBranchRouterLibZip: '0xb48a73F3dC5F8065B3c9F9EDdcCd33979b518841',
  MulticallBranchBridgeAgentLibZip: 'ZERO_ADDRESS', // TODO: Update - not used for now
  NativeToken: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
}

const UlyssesSepolia: IUlyssesArbitrumContracts = {
  ...UlyssesSepoliaBranch,
  RootPort: '0x800De4d33015FeB4e344951aCe8eA2f4F33aE529',
  RootBridgeAgentFactory: '0x4c94fF45284159a1a336197e8F0ee194B0D527F8',
  CoreRootRouter: '0x7a29e9eb2e32075F35fCC5448e930f24d2fB1b62',
  CoreRootBridgeAgent: '0x664Df2DAdc5Fd3E5D5b42D83CFcf162F48051409',
  ERC20hTokenRootFactory: '0xbA564A4bbc30472D8CF8ba61c24627189290E6b6',
  MulticallRootRouter: '0xC7F66dCA3B782983de45e445BdE403Ce36aAB885',
  MulticallRootBridgeAgent: '0xe8074Acb12bD4b5ACaB083718CcE8f998D6a8fa1',
  MulticallRootRouterLibZip: '0x0887db9b1df886bA926EA7853f012B26Cf589e47',
  MulticallRootBridgeAgentLibZip: '0x27e5d2fDE8F24f74A232363785013dd3187CDD01',
}

const UlyssesArbitrumSepolia: IUlyssesCommonContracts = {
  BranchPort: '0x95ab3c1f34Ba0637Bd7533b4Fc74B6A30D16cAf8',
  BranchBridgeAgentFactory: '0x3746841410B8ff846D05Bce56D161Ff71667049F',
  CoreBranchRouter: '0xb03303b6c7c34C34e4B2d5e9F48F3D664779C4f9',
  CoreBranchBridgeAgent: '0xf7F0A5fc625a3f5A92b525AC858B8E257239cE9f',
  ERC20hTokenBranchFactory: '0xe15f57ed19c9ac02B5f95f96Ce50482E4a6714A8',
  MulticallBranchRouter: '0x6bA0FA9D5B866ddc80C0421F1E2229577e9e0dDF',
  MulticallBranchBridgeAgent: '0xfDD0F0e43BEEd971b867E4Db9AdD70C49Ae89225',
  MulticallBranchRouterLibZip: '0xD52C99FDf1A860EdA2C33d160ca318dBD6600aBb',
  MulticallBranchBridgeAgentLibZip: '0x316EEB1515332bD2533173133545B8800ce0D6c0',
  NativeToken: '0x3413055aA47545C9551dE8109fe6948f5376Af39',
}

const UlyssesOptimismSepolia: IUlyssesCommonContracts = {
  BranchPort: '0x507f3CeEA7f2bb4eb3C13A7359ABa0c560172Af9',
  BranchBridgeAgentFactory: '0x2F7Dd1137D158588016b1B0F8d7040dF2923a11E',
  CoreBranchRouter: '0x1690088Af42f1d77f5ed2998d097cbDd4aB6b935',
  CoreBranchBridgeAgent: '0x817BD8e30F5b0A89a73c2c9d4A433f5b783C5902',
  ERC20hTokenBranchFactory: '0x1aE0aE181981BfD675BaB403c7F8A9Ba7843149C',
  MulticallBranchRouter: '0xE9965fE9637E5b53a31b07c107565C6263347fd0',
  MulticallBranchBridgeAgent: '0xcaED1f3A6f47E65c7004Ab020480763cb262585A',
  MulticallBranchRouterLibZip: '0x7bB3d0B4168F062c41EFa71A0d74457Cde0b91c5',
  MulticallBranchBridgeAgentLibZip: '0x205506CB8BE7f5fC537cB0240ffB4273027CF11D',
  NativeToken: '0xAd6A7addf807D846A590E76C5830B609F831Ba2E',
}

const UlyssesPolygonAmoy: IUlyssesCommonContracts = {
  BranchPort: '0x471e76A7CD76A0DbD021F5A3136d1F0828cbD270',
  BranchBridgeAgentFactory: '0x1fc37a909cB3997f96cE395B3Ee9ac268C9bCcdb',
  CoreBranchRouter: '0x68868e60Bb70f9eA3A153334440e0D6aF96bE77A',
  CoreBranchBridgeAgent: '0xE1cEf05Ea3Da03EfE18b01fbd7b11DF059A7aF3F',
  ERC20hTokenBranchFactory: '0x7ddEecA94ce57264410d51E9F73a0f8983b2eAA7',
  MulticallBranchRouter: '0xAfB0F351A9a92220eFC54a92EA5cAE21AcB3D6Da',
  MulticallBranchBridgeAgent: '0x201a51Fe6688AEE94E97c71DAdfa727769fE1AB5',
  MulticallBranchRouterLibZip: '0x9f88DbcD0d2Db9a2433Ce0f4eF1C5d533F032702',
  MulticallBranchBridgeAgentLibZip: '0xf64597697246F09aA71Eb859F69512c4AabD4dE5',
  NativeToken: '0x833bF555AD7201Dba33D4A5AeA88c179468Ca424',
}

export const Ulysses: IUlysses = {
  //Mainnets
  [SupportedChainId.ARBITRUM_ONE]: UlyssesArbitrum,
  [SupportedChainId.MAINNET]: UlyssesEthereum,
  [SupportedChainId.OPTIMISM]: UlyssesEthereum,
  [SupportedChainId.BASE]: UlyssesEthereum,
  [SupportedChainId.POLYGON]: UlyssesEthereum,
  [SupportedChainId.AVAX]: UlyssesEthereum,
  [SupportedChainId.BSC]: UlyssesEthereum,
  [SupportedChainId.METIS]: UlyssesEthereum,

  [SupportedChainId.FANTOM]: UlyssesEthereum,
  [SupportedChainId.SCROLL]: UlyssesEthereum,
  [SupportedChainId.MANTLE]: UlyssesEthereum,
  [SupportedChainId.FRAXTAL]: UlyssesEthereum,
  [SupportedChainId.GNOSIS]: UlyssesEthereum,

  // Testnets
  [SupportedChainId.SEPOLIA]: UlyssesSepolia,
  [SupportedChainId.ARBITRUM_SEPOLIA]: UlyssesArbitrumSepolia,
  [SupportedChainId.OPTIMISM_SEPOLIA]: UlyssesOptimismSepolia,
  [SupportedChainId.POLYGON_AMOY]: UlyssesPolygonAmoy,
}
