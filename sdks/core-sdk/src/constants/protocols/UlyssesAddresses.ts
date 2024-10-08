import { IUlysses, IUlyssesArbitrumContracts, IUlyssesCommonContracts } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

// MAINNET - Ulysses Omnichain Address Definitions per Chain

const UlyssesArbitrumBranch: IUlyssesCommonContracts = {
  BranchPort: '0x79f4b04FFCa54BC946aa0ef8E33eE723467f0192',
  BranchBridgeAgentFactory: '0x3A516edf6158D5BF1dD0B51337053c4aCDf644d9',
  CoreBranchRouter: '0x38DeFD1a1a1E7d6af860eC1Eda6F4c75741d9E7e',
  CoreBranchBridgeAgent: '0x93114b1748B9D4D21f32fa0c1a21040D18Cc8d66',
  ERC20hTokenBranchFactory: '',
  MulticallBranchRouter: '0xE16776FCe6B983e9aB52e9506bD3E14D22bdBDa0',
  MulticallBranchBridgeAgent: '0x62b1C5e4A013A42926cc26510180C4050Dc02779',
  MulticallBranchRouterLibZip: '0x213128EF80B0fDDdB96F09780E8f3DC8477D2869',
  MulticallBranchBridgeAgentLibZip: '0x6CdE6F2a2eFE7A12d62949956889f97A5715f1cd',
  NativeToken: '',
}

const UlyssesArbitrum: IUlyssesArbitrumContracts = {
  ...UlyssesArbitrumBranch,
  RootPort: '0xd3E3599517F2036fA314e468d62135714FC03C56',
  RootBridgeAgentFactory: '0xe0ff9aDA7ff73180beca8d6F69fc8D2505F9539E',
  CoreRootRouter: '0x31E2a6BbC2aF8AEB78DD1FA1FceFE0F672c3E8fe',
  CoreRootBridgeAgent: '0xB8fec761db744E59dCC3141FEB18e8A63646233c',
  ERC20hTokenRootFactory: '0xB9833D1ee7D6B5478104f618436E5dF4EAEB55c7',
  MulticallRootRouter: '0xEbdcaAb09ec0491E2a632e3e8F2b39f081d878DD',
  MulticallRootBridgeAgent: '0x4EE41d129955EEd4a10CBA785773BEEA6DC13126',
  MulticallRootRouterLibZip: '0x3Ad10d46ABedE5E56925aE97BFc131054F834333',
  MulticallRootBridgeAgentLibZip: '0x4D7f23c920696beC43F0f76D20BC4C431e72D91c',
}

const UlyssesEthereum: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0x4e1E0DFF602Bc7B195ecB57e5b8F9cb03b440D27',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0x509fDD915c2020DA07E36aaF55F31B9648b81ba9',
  ERC20hTokenBranchFactory: '0xaA96607691E801376c5cBcD2E8F088C9E1D1FeB4',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0xFe59E33F7c7466f5F459F66d40A97C6f778D5DE4',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0xce0882FF10E1E68d54393234aD29b7e24d7a18E8',
  NativeToken: '0xe2e5DF2786A89c06C36e66015F3F6fA235D5fb76',
}

const UlyssesPolygon: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0x4Ad2437b9dEe82D9A22F96894e8d483E1b2d9b7d',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0xBb42804e272e430B8e2fb3D384AB16e0d201Afa2',
  ERC20hTokenBranchFactory: '0xd7D8458823934233376d9fFb370A3293C4231860',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0xE6F57FF398B26aD6278b51E4A894fd70Db2E5d4E',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0xf8aae47a6A12552Bc714e47F8d98446d537634aA',
  NativeToken: '0x5b4f8ca696BAfAe2943547144F2066199598CfCb',
}

const UlyssesAvax: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0x1E8FdD836a2d460bdD62FbDB80CFa2984B1B3D2A',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0x9Da6E4D3faf214A708CD14c2016bCCCa1507e11A',
  ERC20hTokenBranchFactory: '0xfF6927f1722C2500f9CB68e5D3768ddAD5031Bf2',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0x90e611E922720540804bbe3A05D4A8Ee0b9c5fBb',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0x41916Ad45cD2303ab42110659c0376c4E3Dd0554',
  NativeToken: '0xfD92eE19f206f313F8D267026B337a62F77b1E4c',
}

const UlyssesOptimism: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0xd971e3230A6ebBDd66341D7C5ECF7ad0a0224DA2',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0xbCa8AC32b6bc35b1F876D6aB598b93a35a33fD04',
  ERC20hTokenBranchFactory: '0x940A58c1623f8eE80398668a7598D787A4Fa88eE',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0xd207aD94c4A5Fb1c32dFe0714B024525A1774B20',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0x419e450B899CB40A00d5e804870D57Ab3F92351F',
  NativeToken: '0x0F1651C8f1e22097b80A61d1CcffC54A51aaC725',
}

const UlyssesBase: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0xa0DE1545E6B0E793e5dEd724736045E991EFAe4d',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0xd4d0F211Cd400440c6605751c1f56530a996c7ff',
  ERC20hTokenBranchFactory: '0x094AB8e4CC215ac04DAB8b6260D53c4504cec060',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0x5b710604f8b969704c619F78993aE610075CDe8c',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0x9C87185F3962e131A561bb4a2CfD47712BF104a4',
  NativeToken: '0x10A45947C278D6F49049D120F6b8Cf527D023f53',
}

const UlyssesBSC: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0xfD0d9035ec29b614dE6b5673A16cC6eC78cA44F1',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0xb327582d73498EAb059005846E64dcb3618fff49',
  ERC20hTokenBranchFactory: '0xF04dE46e174e63F0c9781508cCE78b96E99052B1',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0x39BEC4399C49450f98F6f32fb29f86720e0a6621',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0xa9A21A9Bb20FC365AB7b36B2A31dCa3a4648bF1f',
  NativeToken: '0x7eb5C81d21BCFa970fb280e5A8FB08652448Ed2b',
}

const UlyssesMetis: IUlyssesCommonContracts = {
  BranchPort: '0x0000151d008235A6cC00004F00FA2bDF9dF95400',
  BranchBridgeAgentFactory: '0x6160d53fCbf457Bd728Def380d3C442EEa775087',
  CoreBranchRouter: '0xd0f74CbB2a5f67F48E10F7B5e293e0f78B79B599',
  CoreBranchBridgeAgent: '0x4B232390F5F533973775BC516E3A4cb2062BF33E',
  ERC20hTokenBranchFactory: '0xc71956bDA00E1225857421b6809FEbdd09900938',
  MulticallBranchRouter: '0xa465E96470f0919B2fb91b2f88D57DeAfB1D766a',
  MulticallBranchBridgeAgent: '0xa0026577F8A68137A402E4eC1c3f69c5092B124F',
  MulticallBranchRouterLibZip: '0x5786EfFF72450E66e91De12D0e95dF71799b524F',
  MulticallBranchBridgeAgentLibZip: '0xB06Fc506f82B6DcEEf0643d9132d12e59fD79c24',
  NativeToken: '0x1ce28C4f77991b604868bA48f9154408313C65b6',
}

// TESTNET - Ulysses Omnichain Address Definitions per Chain

const UlyssesSepoliaBranch: IUlyssesCommonContracts = {
  BranchPort: '0xE2B6Dc3e16873aC460d01307898eba5e3ef72165',
  BranchBridgeAgentFactory: '0xbDf7Df30b8575a112cA8B74486f616f97548573C',
  CoreBranchRouter: '0xE9E180453f1318c9518166f53BF5b55Cfb5302Cf',
  CoreBranchBridgeAgent: ZERO_ADDRESS, // TODO: Update - not used for now
  ERC20hTokenBranchFactory: ZERO_ADDRESS,
  MulticallBranchRouter: '0x9FF07935Aa66aCCEc439a7bc830645B77198E2CF',
  MulticallBranchBridgeAgent: '0x141282d0442adda1274b9eb7ca368e24b2e06639',
  MulticallBranchRouterLibZip: '0xb48a73F3dC5F8065B3c9F9EDdcCd33979b518841',
  MulticallBranchBridgeAgentLibZip: ZERO_ADDRESS, // TODO: Update - not used for now
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

const UlyssesBaseSepolia: IUlyssesCommonContracts = {
  BranchPort: '0x184f1c3c450702C02bB99137403B125243cB5e66',
  BranchBridgeAgentFactory: '0x1fc37a909cB3997f96cE395B3Ee9ac268C9bCcdb',
  CoreBranchRouter: '0x9f88DbcD0d2Db9a2433Ce0f4eF1C5d533F032702',
  CoreBranchBridgeAgent: '0xcf76904D24c5b99411B3D481049F466F83490bB7',
  ERC20hTokenBranchFactory: '0x471e76A7CD76A0DbD021F5A3136d1F0828cbD270',
  MulticallBranchRouter: '0x7ddEecA94ce57264410d51E9F73a0f8983b2eAA7',
  MulticallBranchBridgeAgent: '0x55D69928F08695a724E8eD65EaaDBA41809a3eFc',
  MulticallBranchRouterLibZip: '0xAfB0F351A9a92220eFC54a92EA5cAE21AcB3D6Da',
  MulticallBranchBridgeAgentLibZip: '0x188f596da34015cb2FD8D90770c024c8a271e513',
  NativeToken: '0x4200000000000000000000000000000000000006',
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
  [SupportedChainId.OPTIMISM]: UlyssesOptimism,
  [SupportedChainId.BASE]: UlyssesBase,
  [SupportedChainId.POLYGON]: UlyssesPolygon,
  [SupportedChainId.AVAX]: UlyssesAvax,
  [SupportedChainId.BSC]: UlyssesBSC,
  [SupportedChainId.METIS]: UlyssesMetis,

  // [SupportedChainId.FANTOM]: UlyssesEthereum,
  // [SupportedChainId.SCROLL]: UlyssesEthereum,
  // [SupportedChainId.MANTLE]: UlyssesEthereum,
  // [SupportedChainId.FRAXTAL]: UlyssesEthereum,
  // [SupportedChainId.GNOSIS]: UlyssesEthereum,

  // Testnets
  [SupportedChainId.SEPOLIA]: UlyssesSepolia,
  [SupportedChainId.ARBITRUM_SEPOLIA]: UlyssesArbitrumSepolia,
  [SupportedChainId.OPTIMISM_SEPOLIA]: UlyssesOptimismSepolia,
  [SupportedChainId.BASE_SEPOLIA]: UlyssesBaseSepolia,

  [SupportedChainId.POLYGON_AMOY]: UlyssesPolygonAmoy,
}
