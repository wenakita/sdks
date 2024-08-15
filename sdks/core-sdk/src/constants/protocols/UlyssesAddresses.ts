import { IUlysses, IUlyssesArbitrumContracts, IUlyssesCommonContracts } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

// MAINNET - Ulysses Omnichain Address Definitions per Chain

const UlyssesArbitrumBranch: IUlyssesCommonContracts = {
  BranchPort: '0x0c453ef35986E1d8dA22043fF00BF03cEB42e1f7',
  BranchBridgeAgentFactory: '0x3d1b7079745d6148a273b36C03228B5d0D84dEf7',
  CoreBranchRouter: '0xaAa6C918bc5b391553221A1a32423658480943FD',
  CoreBranchBridgeAgent: '0xfD1Ff0625D7bcE2A9506Ec8AA7B5d3CFa0C766E3',
  ERC20hTokenBranchFactory: '',
  MulticallBranchRouter: '0x880Cc05E65578091a6793749b55122198a740783',
  MulticallBranchBridgeAgent: '0xf5CB76a6Fec2706F4B97e8F1D2cc9f09ae930835',
  MulticallBranchRouterLibZip: '0x7AdD6EBeBbb24c8d6E135c6C4fc168f676363cf1',
  MulticallBranchBridgeAgentLibZip: '0x285FADBCe14168B3D6fCFA20E4f0D0b79719168c',
  NativeToken: '',
}

const UlyssesArbitrum: IUlyssesArbitrumContracts = {
  ...UlyssesArbitrumBranch,
  RootPort: '0x5399Eee5073bC1018233796a291Ffd6a78E26cbb',
  RootBridgeAgentFactory: '0x627DCcd47FBaDfBd601894aeeA289c23Db67D466',
  CoreRootRouter: '0xcD2fDCb25Ae2106B4f860bf92B4Af5F326a00Eb3',
  CoreRootBridgeAgent: '0xF06b9B31B46d3301221EdA97900FE7C5aaa043d6',
  ERC20hTokenRootFactory: '0xE6Ac784d1844CAd3D4CcB3Cd1114aCdd1623bDed',
  MulticallRootRouter: '0x8F9B85c85fB4E0C74dE75Dc883966FF363440a7d',
  MulticallRootBridgeAgent: '0x667C3e523AA1a26C4D15901C0d8F24F6c5F51Da3',
  MulticallRootRouterLibZip: '0xcb3B7bE0056e2064565Bb2b1d635A87180C33d25',
  MulticallRootBridgeAgentLibZip: '0xdc10Da7318F0C292b2fB1ac1CD2a9DD3A31710FE',
}

const UlyssesEthereum: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
}

const UlyssesPolygon: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
}

const UlyssesAvax: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
}

const UlyssesOptimism: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
}

const UlyssesBase: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
}

const UlyssesBSC: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
}

const UlyssesMetis: IUlyssesCommonContracts = {
  BranchPort: '0x6C6d3FB0289039b0FCa2E7244A06Cf9403464646',
  BranchBridgeAgentFactory: '',
  CoreBranchRouter: '0xf265B4F5c68c3e5767aC5245500D2B8691f369e4',
  CoreBranchBridgeAgent: '0x400d7EBC40C6C32bb16E5E5dE73029E9456a1b73',
  ERC20hTokenBranchFactory: '0x5c41F659Dba16A061BbE5e48FBE9eAeEe2a7F39b',
  MulticallBranchRouter: '0x435A9E41BefdfB8B070df12afeA57921F17970C5',
  MulticallBranchBridgeAgent: '0x925b2421fbDA55aCD8A28A813BC3Dcc9078943cC',
  MulticallBranchRouterLibZip: '0x72F2e1394d4D748824FD015c6FC4b6d16E0a1E7D',
  MulticallBranchBridgeAgentLibZip: '0xC16bE3db4104F088Fc464f51C9feccB4eCff37A9',
  NativeToken: '0xD02498F4A36eAf1a5b522ee262AF8FEA6eCeAD53',
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
