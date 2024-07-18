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
  BranchPort: '0xa49513c755d01981Ca88DE2EfB1747C05F31b98b',
  BranchBridgeAgentFactory: '0x473a473f70C8e740fb50B9566752B3acf112c4D4',
  CoreBranchRouter: '0xFc1b6005Ae1004d0ee3818aC73C2Cf3e5c740804',
  CoreBranchBridgeAgent: '0xe8Daa01b4f143e0e9c05CeE8e03fB9fe62180346',
  ERC20hTokenBranchFactory: ZERO_ADDRESS,
  MulticallBranchRouter: '0x6aeD4b1d1C4eCCdddD7EB3E7Ab23b3773E90Ea75',
  MulticallBranchBridgeAgent: '0xF7C7335E449BEB047cd5aE4A49f9204b3D62b562',
  MulticallBranchRouterLibZip: '0x94D68AC487Bd954e664252498fFb8972bDB64C5d',
  MulticallBranchBridgeAgentLibZip: '0xe8Daa01b4f143e0e9c05CeE8e03fB9fe62180346',
  NativeToken: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
}

const UlyssesSepolia: IUlyssesArbitrumContracts = {
  ...UlyssesSepoliaBranch,
  RootPort: '0xB067c40f648D6b8811eF1334BFF37d3465b67aBd',
  RootBridgeAgentFactory: '0x3c66dA0c4460CeFC77cFB2246Fc3c120Be819c45',
  CoreRootRouter: '0x25cEC24387d7cE1d7410453748BC258cD8971Fc6',
  CoreRootBridgeAgent: '0x572533ec1C4481B0fAA12Fa7FeC9c31214e0574F',
  ERC20hTokenRootFactory: '0x1d1730C8fA1596597d46b5db9768CbB73877f992',
  MulticallRootRouter: '0x0C657CC9B8e5Cf0eBaD299B5AbA126B748548CF5',
  MulticallRootBridgeAgent: '0x50168B7fD025BCa8Db4327E7850361bf56a44797',
  MulticallRootRouterLibZip: '0xCF493a4C9F99d1eB477a513C67F1Ac61F3c74b0d',
  MulticallRootBridgeAgentLibZip: '0x5f2a2E1BcaF4C1aa8634D5E4d837876f02f99Bb0',
}

const UlyssesArbitrumSepolia: IUlyssesCommonContracts = {
  BranchPort: '0x1F506CA390210c8c24b50C272500311ec056bAA8',
  BranchBridgeAgentFactory: '0x79de9e4f4775872fF0BF9d9C67e1D6CD9F46158B',
  CoreBranchRouter: '0x1137f9bA38ee1BB493437aA0EB0495c79C4192f4',
  CoreBranchBridgeAgent: '0xb9d19326aC031f0647C8Ead8c4c4D7Cc8E89AB97',
  ERC20hTokenBranchFactory: '0xE1849e9fD7b3fa6fe306D1bD26b9f709b7c15B90',
  MulticallBranchRouter: '0x6AafA0900d5012Ab65800Ca5C60E14ED06ce1d3F',
  MulticallBranchBridgeAgent: '0xAb9cF7ECb9Ff05E8F6A74CFB2B3F2c127F603C89',
  MulticallBranchRouterLibZip: '0x5323faa64dcfB0a4638e12c0D02C26337Dd53e3A',
  MulticallBranchBridgeAgentLibZip: '0x05EbD355de6F41bF30574d1E16b21aF2484F1339',
  NativeToken: '0x3413055aA47545C9551dE8109fe6948f5376Af39',
}

const UlyssesOptimismSepolia: IUlyssesCommonContracts = {
  BranchPort: '0x9882D8Fb9DC070F725687c973e100C9abC10D66D',
  BranchBridgeAgentFactory: '0x5119fe9b34b4AB6d608ACd4153560C3dc81f69A2',
  CoreBranchRouter: '0xb03E9773ac0E936b4C97ab4cdBf675B5323Ef19A',
  CoreBranchBridgeAgent: '0x646Fc4E7Db3951A525ae86532F911509a03c7554',
  ERC20hTokenBranchFactory: '0x5493D8c81e8Cc84F016b269D91f01eBc02EEd19D',
  MulticallBranchRouter: '0x0319Cb0CCA4983A885254e2e5F52ACe5fC69029b',
  MulticallBranchBridgeAgent: '0x8B1684fa73B7dDfa5535e6Cdc02BF41C1020d8E3',
  MulticallBranchRouterLibZip: '0x010b5027EDe83FA51390192291D1aefEBa17470B',
  MulticallBranchBridgeAgentLibZip: '0x1783Ec4c3425fF89316A344e45059b8069f5e977',
  NativeToken: '0xAd6A7addf807D846A590E76C5830B609F831Ba2E',
}

const UlyssesAvaxFuji: IUlyssesCommonContracts = {
  BranchPort: '0x07Da720AD5E434971dbe77C7fC85b7b44d5aC704',
  BranchBridgeAgentFactory: '0xE274fe1C5e708633906b89c86C3F3AAC9B9b02E2',
  CoreBranchRouter: '0x262E75e4DE2942181bD18DA2360be9699ebf051A',
  CoreBranchBridgeAgent: '0x5fA5455DbC48AcBdC3Bcb97bA01Fbb8D3b911CaD',
  ERC20hTokenBranchFactory: '0x203050400Fd94c07eDE12894678891EAb43b790A',
  MulticallBranchRouter: '0x2EE5407017B878774b58c34A8c09CAcC94aDd69B',
  MulticallBranchBridgeAgent: '0xe91a8fD1A9e41624ba7501d9aC1F3FEfF5C16696',
  MulticallBranchRouterLibZip: '0x24F80EaD7670813450fDC4f2631E426d7fd71201',
  MulticallBranchBridgeAgentLibZip: '0x413934EE6F8d24DaCF9d1a5E4a5e913D570f474c',
  NativeToken: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
}

export const Ulysses: IUlysses = {
  //Mainnets
  [SupportedChainId.ARBITRUM_ONE]: UlyssesArbitrum,
  [SupportedChainId.MAINNET]: UlyssesEthereum,
  [SupportedChainId.OPTIMISM]: UlyssesEthereum,
  [SupportedChainId.POLYGON]: UlyssesEthereum,
  [SupportedChainId.FANTOM]: UlyssesEthereum,
  [SupportedChainId.AVAX]: UlyssesEthereum,
  [SupportedChainId.BSC]: UlyssesEthereum,
  [SupportedChainId.METIS]: UlyssesEthereum,

  // Testnets
  [SupportedChainId.SEPOLIA]: UlyssesSepolia,
  [SupportedChainId.ARBITRUM_SEPOLIA]: UlyssesArbitrumSepolia,
  [SupportedChainId.OPTIMISM_SEPOLIA]: UlyssesOptimismSepolia,
  [SupportedChainId.POLYGON_MUMBAI]: UlyssesOptimismSepolia,
  [SupportedChainId.FANTOM_TESTNET]: UlyssesOptimismSepolia,
  [SupportedChainId.BSC_TESTNET]: UlyssesOptimismSepolia,
  [SupportedChainId.AVAX_FUJI]: UlyssesAvaxFuji,
}
