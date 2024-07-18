import { chainIdMap } from '../types/basic'

/**
 * Holds the chain ids for the supported chains
 */
export enum SupportedChainId {
  // Mainnet chainIds
  ARBITRUM_ONE = 42161, // ROOT_CHAIN_ID
  MAINNET = 1,
  OPTIMISM = 10,
  POLYGON = 137,
  FANTOM = 250,
  BSC = 56,
  AVAX = 43114,
  METIS = 1088,

  // Testnet chainIds
  SEPOLIA = 11155111, // ROOT_CHAIN_ID
  ARBITRUM_SEPOLIA = 421614,
  OPTIMISM_SEPOLIA = 11155420,
  POLYGON_MUMBAI = 80001,
  FANTOM_TESTNET = 4002,
  BSC_TESTNET = 97,
  AVAX_FUJI = 43113,
  // METIS_SEPOLIA = 59901,
}

/**
 * Holds the chain ids for the supported chains on Layer0
 */
export enum SupportedLayerzeroChainId {
  // Mainnet chainIds
  ARBITRUM_ONE = 110, // ROOT_CHAIN_ID
  MAINNET = 101,
  OPTIMISM = 111,
  POLYGON = 137,
  FANTOM = 250,
  BSC = 56,
  AVAX = 43114,
  METIS = 1088,

  // Testnet chainIds
  SEPOLIA = 10161, // ROOT_CHAIN_ID
  ARBITRUM_SEPOLIA = 10231,
  OPTIMISM_SEPOLIA = 10232,
  POLYGON_MUMBAI = 10109,
  FANTOM_TESTNET = 4002,
  BSC_TESTNET = 10102,
  AVAX_FUJI = 10106,
  // METIS_SEPOLIA = 59901,
}

/**
 * Holds the root chain id
 */
export const ROOT_CHAIN_ID = SupportedChainId.SEPOLIA
// export const ROOT_CHAIN_ID = SupportedChainId.ARBITRUM_ONE //TODO: change this for production use

/**
 * Holds the chain ids to layerzero chain ids for the supported chains
 */
export const LZ_CHAIN_ID_FROM_EVM_CHAIN_ID: chainIdMap = {
  //Mainnets
  [SupportedChainId.MAINNET]: SupportedLayerzeroChainId.MAINNET,
  [SupportedChainId.ARBITRUM_ONE]: SupportedLayerzeroChainId.ARBITRUM_ONE,
  [SupportedChainId.OPTIMISM]: SupportedLayerzeroChainId.OPTIMISM,
  [SupportedChainId.POLYGON]: SupportedLayerzeroChainId.POLYGON,
  [SupportedChainId.FANTOM]: SupportedLayerzeroChainId.FANTOM,
  [SupportedChainId.BSC]: SupportedLayerzeroChainId.BSC,
  [SupportedChainId.AVAX]: SupportedLayerzeroChainId.AVAX,
  [SupportedChainId.METIS]: SupportedLayerzeroChainId.METIS,

  //Testnets
  [SupportedChainId.SEPOLIA]: SupportedLayerzeroChainId.SEPOLIA,
  [SupportedChainId.ARBITRUM_SEPOLIA]: SupportedLayerzeroChainId.ARBITRUM_SEPOLIA,
  [SupportedChainId.OPTIMISM_SEPOLIA]: SupportedLayerzeroChainId.OPTIMISM_SEPOLIA,
  [SupportedChainId.POLYGON_MUMBAI]: SupportedLayerzeroChainId.POLYGON_MUMBAI,
  [SupportedChainId.FANTOM_TESTNET]: SupportedLayerzeroChainId.FANTOM_TESTNET,
  [SupportedChainId.BSC_TESTNET]: SupportedLayerzeroChainId.BSC_TESTNET,
  [SupportedChainId.AVAX_FUJI]: SupportedLayerzeroChainId.AVAX_FUJI,
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
  [SupportedLayerzeroChainId.FANTOM]: SupportedChainId.FANTOM,
  [SupportedLayerzeroChainId.BSC]: SupportedChainId.BSC,
  [SupportedLayerzeroChainId.AVAX]: SupportedChainId.AVAX,
  [SupportedLayerzeroChainId.METIS]: SupportedChainId.METIS,

  //Testnets
  [SupportedLayerzeroChainId.SEPOLIA]: SupportedChainId.SEPOLIA,
  [SupportedLayerzeroChainId.ARBITRUM_SEPOLIA]: SupportedChainId.ARBITRUM_SEPOLIA,
  [SupportedLayerzeroChainId.OPTIMISM_SEPOLIA]: SupportedChainId.OPTIMISM_SEPOLIA,
  [SupportedLayerzeroChainId.POLYGON_MUMBAI]: SupportedChainId.POLYGON_MUMBAI,
  [SupportedLayerzeroChainId.FANTOM_TESTNET]: SupportedChainId.FANTOM_TESTNET,
  [SupportedLayerzeroChainId.BSC_TESTNET]: SupportedChainId.BSC_TESTNET,
  [SupportedLayerzeroChainId.AVAX_FUJI]: SupportedChainId.AVAX_FUJI,
}
