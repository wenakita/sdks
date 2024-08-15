import { chainIdMap } from '../types/basic'

/**
 * Holds the chain ids for the supported chains
 */
export enum SupportedChainId {
  // Mainnet chainIds
  ARBITRUM_ONE = 42161, // ROOT_CHAIN_ID
  MAINNET = 1,
  OPTIMISM = 10,
  BASE = 8453,
  BSC = 56,
  POLYGON = 137,
  AVAX = 43114,
  METIS = 1088,

  // Not shown in UI. But has contracts deployed
  // FANTOM = 250,
  // SCROLL = 534352,
  // MANTLE = 5000,
  // FRAXTAL = 252,
  // GNOSIS = 100,
  // // BERA = ,

  // Testnet chainIds
  SEPOLIA = 11155111, // ROOT_CHAIN_ID
  ARBITRUM_SEPOLIA = 421614,
  OPTIMISM_SEPOLIA = 11155420,
  BASE_SEPOLIA = 84532,

  // Not shown in UI. But has contracts deployed
  POLYGON_AMOY = 80002,

  // // Not deployed and shown in UI for now
  // AVAX_FUJI = 43113,
  // BSC_TESTNET = 97,
  // FANTOM_TESTNET = 4002,
}

/**
 * Holds the chain ids for the supported chains on Layer0
 */
export enum SupportedLayerzeroChainId {
  // Mainnet chainIds
  ARBITRUM_ONE = 110, // ROOT_CHAIN_ID
  MAINNET = 101,
  OPTIMISM = 111,
  BASE = 184,
  POLYGON = 137,
  BSC = 102,
  AVAX = 106,
  METIS = 151,

  // Not shown in UI. But has contracts deployed
  // FANTOM = 112,
  // SCROLL = 214,
  // MANTLE = 181,
  // FRAXTAL = 255,
  // GNOSIS = 145,
  // // BERA = ,

  // Testnet chainIds
  SEPOLIA = 10161, // ROOT_CHAIN_ID
  ARBITRUM_SEPOLIA = 10231,
  OPTIMISM_SEPOLIA = 10232,
  BASE_SEPOLIA = 10245,

  POLYGON_AMOY = 10267,

  // Not deployed and shown in UI for now
  // BSC_TESTNET = 10102,
  // AVAX_FUJI = 10106,
  // FANTOM_TESTNET = 4002,
}

/**
 * Holds the root chain id
 */
export const ROOT_CHAIN_ID = SupportedChainId.ARBITRUM_ONE

/**
 * Holds the chain ids to layerzero chain ids for the supported chains
 */
export const LZ_CHAIN_ID_FROM_EVM_CHAIN_ID: chainIdMap = {
  //Mainnets
  [SupportedChainId.MAINNET]: SupportedLayerzeroChainId.MAINNET,
  [SupportedChainId.ARBITRUM_ONE]: SupportedLayerzeroChainId.ARBITRUM_ONE,
  [SupportedChainId.OPTIMISM]: SupportedLayerzeroChainId.OPTIMISM,
  [SupportedChainId.POLYGON]: SupportedLayerzeroChainId.POLYGON,
  [SupportedChainId.BSC]: SupportedLayerzeroChainId.BSC,
  [SupportedChainId.AVAX]: SupportedLayerzeroChainId.AVAX,
  [SupportedChainId.METIS]: SupportedLayerzeroChainId.METIS,
  [SupportedChainId.BASE]: SupportedLayerzeroChainId.BASE,

  // [SupportedChainId.FANTOM]: SupportedLayerzeroChainId.FANTOM,
  // [SupportedChainId.SCROLL]: SupportedLayerzeroChainId.SCROLL,
  // [SupportedChainId.MANTLE]: SupportedLayerzeroChainId.MANTLE,
  // [SupportedChainId.FRAXTAL]: SupportedLayerzeroChainId.FRAXTAL,
  // [SupportedChainId.GNOSIS]: SupportedLayerzeroChainId.GNOSIS,

  //Testnets
  [SupportedChainId.SEPOLIA]: SupportedLayerzeroChainId.SEPOLIA,
  [SupportedChainId.ARBITRUM_SEPOLIA]: SupportedLayerzeroChainId.ARBITRUM_SEPOLIA,
  [SupportedChainId.OPTIMISM_SEPOLIA]: SupportedLayerzeroChainId.OPTIMISM_SEPOLIA,
  [SupportedChainId.BASE_SEPOLIA]: SupportedLayerzeroChainId.BASE_SEPOLIA,

  [SupportedChainId.POLYGON_AMOY]: SupportedLayerzeroChainId.POLYGON_AMOY,

  // [SupportedChainId.FANTOM_TESTNET]: SupportedLayerzeroChainId.FANTOM_TESTNET,
  // [SupportedChainId.BSC_TESTNET]: SupportedLayerzeroChainId.BSC_TESTNET,
  // [SupportedChainId.AVAX_FUJI]: SupportedLayerzeroChainId.AVAX_FUJI,
}

/**
 * Holds the layerzero chain ids to chain ids for the supported chains
 */
export const EVM_CHAIN_ID_FROM_LZ_CHAIN_ID: chainIdMap = {
  //Mainnets
  [SupportedLayerzeroChainId.MAINNET]: SupportedChainId.MAINNET,
  [SupportedLayerzeroChainId.ARBITRUM_ONE]: SupportedChainId.ARBITRUM_ONE,
  [SupportedLayerzeroChainId.OPTIMISM]: SupportedChainId.OPTIMISM,
  [SupportedLayerzeroChainId.POLYGON]: SupportedChainId.POLYGON,
  [SupportedLayerzeroChainId.BSC]: SupportedChainId.BSC,
  [SupportedLayerzeroChainId.AVAX]: SupportedChainId.AVAX,
  [SupportedLayerzeroChainId.METIS]: SupportedChainId.METIS,
  [SupportedLayerzeroChainId.BASE]: SupportedChainId.BASE,

  // [SupportedLayerzeroChainId.FANTOM]: SupportedChainId.FANTOM,
  // [SupportedLayerzeroChainId.SCROLL]: SupportedChainId.SCROLL,
  // [SupportedLayerzeroChainId.MANTLE]: SupportedChainId.MANTLE,
  // [SupportedLayerzeroChainId.FRAXTAL]: SupportedChainId.FRAXTAL,
  // [SupportedLayerzeroChainId.GNOSIS]: SupportedChainId.GNOSIS,

  //Testnets
  [SupportedLayerzeroChainId.SEPOLIA]: SupportedChainId.SEPOLIA,
  [SupportedLayerzeroChainId.ARBITRUM_SEPOLIA]: SupportedChainId.ARBITRUM_SEPOLIA,
  [SupportedLayerzeroChainId.OPTIMISM_SEPOLIA]: SupportedChainId.OPTIMISM_SEPOLIA,
  [SupportedLayerzeroChainId.POLYGON_AMOY]: SupportedChainId.POLYGON_AMOY,

  // [SupportedLayerzeroChainId.FANTOM_TESTNET]: SupportedChainId.FANTOM_TESTNET,
  // [SupportedLayerzeroChainId.BSC_TESTNET]: SupportedChainId.BSC_TESTNET,
  // [SupportedLayerzeroChainId.AVAX_FUJI]: SupportedChainId.AVAX_FUJI,
}
