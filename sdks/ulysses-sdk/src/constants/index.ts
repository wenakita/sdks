import JSBI from 'jsbi'
import { SupportedChainId } from 'maia-core-sdk'

import { gasParamsMap } from '../types'

export const ROOT_CHAIN_IDS = [SupportedChainId.ARBITRUM_ONE, SupportedChainId.SEPOLIA]

export const EVM_CHAIN_ID_TO_ROOT_CHAIN_ID: { [key in SupportedChainId]: SupportedChainId } = {
  //Mainnets
  [SupportedChainId.MAINNET]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.ARBITRUM_ONE]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.OPTIMISM]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.POLYGON]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.BSC]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.AVAX]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.METIS]: SupportedChainId.ARBITRUM_ONE,
  [SupportedChainId.BASE]: SupportedChainId.ARBITRUM_ONE,

  // [SupportedChainId.FANTOM]: SupportedChainId.ARBITRUM_ONE,
  // [SupportedChainId.SCROLL]: SupportedChainId.ARBITRUM_ONE,
  // [SupportedChainId.MANTLE]: SupportedChainId.ARBITRUM_ONE,
  // [SupportedChainId.FRAXTAL]: SupportedChainId.ARBITRUM_ONE,
  // [SupportedChainId.GNOSIS]: SupportedChainId.ARBITRUM_ONE,

  //Testnets
  [SupportedChainId.SEPOLIA]: SupportedChainId.SEPOLIA,
  [SupportedChainId.ARBITRUM_SEPOLIA]: SupportedChainId.SEPOLIA,
  [SupportedChainId.OPTIMISM_SEPOLIA]: SupportedChainId.SEPOLIA,
  [SupportedChainId.BASE_SEPOLIA]: SupportedChainId.SEPOLIA,

  [SupportedChainId.POLYGON_AMOY]: SupportedChainId.SEPOLIA,

  // [SupportedChainId.FANTOM_TESTNET]: SupportedChainId.SEPOLIA,
  // [SupportedChainId.BSC_TESTNET]: SupportedChainId.SEPOLIA,
  // [SupportedChainId.AVAX_FUJI]: SupportedChainId.SEPOLIA,
}

/**
 * Holds the action ids for the branch router.
 * @param NO_ASSET_DEPOSIT - The action doesn't require any asset to be deposited.
 * @param SINGLE_ASSET_DEPOSIT - The action requires a single asset to be deposited.
 * @param MULTIPLE_ASSET_DEPOSIT - The action requires multiple assets to be deposited.
 */
export const BRANCH_BRIDGE_AGENT_ACTION_ID = {
  NO_ASSET_DEPOSIT: 1,
  SINGLE_ASSET_DEPOSIT: 2,
  MULTIPLE_ASSET_DEPOSIT: 3,
  RETRIEVE_SETTLEMENT: 4,
  FALLBACK: 5,
} as const

/**
 * Holds the base gas for the branch bridge agent actions.
 * @param NO_ASSET_DEPOSIT
 * @param SINGLE_ASSET_DEPOSIT
 * @param MULTIPLE_ASSET_DEPOSIT
 */
export const BRANCH_BRIDGE_AGENT_ACTION_BASE_GAS = {
  NO_ASSET_DEPOSIT: 100_000,
  SINGLE_ASSET_DEPOSIT: 150_000,
  MULTIPLE_ASSET_DEPOSIT: 200_000,
  SINGLE_ASSET_DEPOSIT_WITH_FALLBACK: 290_000,
  MULTIPLE_ASSET_DEPOSIT_WITH_FALLBACK: 340_000,
  RETRIEVE_SETTLEMENT: 100_000,
  FALLBACK: 140_000,
} as const

/**
 * Holds the action ids for the Core Branch Router.
 * @param RECEIVE_ADD_GLOBAL_TOKEN
 * @param RECEIVE_ADD_BRIDGE_AGENT
 * @param TOGGLE_BRANCH_BRIDGE_AGENT_FATORY
 * @param TOGGLE_STRATEGY_TOKEN
 * @param UPDATE_STRATEGY_TOKEN
 * @param TOGGLE_PORT_STRATEGY
 * @param UPDATE_PORT_STRATEGY
 * @param SET_CORE_BRANCH_ROUTER
 * @param SWEEP
 */
export const CORE_BRANCH_ROUTER_FUNC_ID = {
  RECEIVE_ADD_GLOBAL_TOKEN: 1,
  RECEIVE_ADD_BRIDGE_AGENT: 2,
  TOGGLE_BRANCH_BRIDGE_AGENT_FATORY: 3,
  TOGGLE_STRATEGY_TOKEN: 4,
  UPDATE_STRATEGY_TOKEN: 5,
  TOGGLE_PORT_STRATEGY: 6,
  UPDATE_PORT_STRATEGY: 7,
  SET_CORE_BRANCH_ROUTER: 8,
  SWEEP: 9,
} as const

/**
 * Holds the action ids for the Core Root Router.
 */
export const CORE_ROOT_ROUTER_FUNC_ID = {
  ADD_GLOBAL_TOKEN: 1,
  ADD_LOCAL_TOKEN: 2,
  SET_LOCAL_TOKEN: 3,
  SYNC_BRANCH_BRIDGE_AGENT: 4,
} as const

/**
 * Holds the action ids for the Root Bridge Agent.
 * @param NO_ASSET_DEPOSIT
 * @param SINGLE_ASSET_DEPOSIT
 * @param MULTIPLE_ASSET_DEPOSIT
 * @param SIGNED_NO_ASSET_DEPOSIT
 * @param SIGNED_SINGLE_ASSET_DEPOSIT
 * @param SIGNED_MULTIPLE_ASSET_DEPOSIT
 * @param RETRY_SETTLEMENT
 * @param RETRIEVE_DEPOSIT
 * @param FALLBACK
 */
export const ROOT_BRIDGE_AGENT_ACTION_ID = {
  NO_ASSET_DEPOSIT: 1,
  SINGLE_ASSET_DEPOSIT: 2,
  MULTIPLE_ASSET_DEPOSIT: 3,
  SIGNED_NO_ASSET_DEPOSIT: 4,
  SIGNED_SINGLE_ASSET_DEPOSIT: 5,
  SIGNED_MULTIPLE_ASSET_DEPOSIT: 6,
  RETRY_SETTLEMENT: 7,
  RETRIEVE_DEPOSIT: 8,
  FALLBACK: 9,
} as const

/**
 * Holds the base gas for the Root Bridge Agent actions.
 * @param NO_ASSET_DEPOSIT
 * @param SINGLE_ASSET_DEPOSIT
 * @param MULTIPLE_ASSET_DEPOSIT
 * @param SIGNED_NO_ASSET_DEPOSIT
 * @param SIGNED_SINGLE_ASSET_DEPOSIT
 * @param SIGNED_MULTIPLE_ASSET_DEPOSIT
 * @param RETRY_SETTLEMENT
 * @param RETRIEVE_DEPOSIT
 * @param FALLBACK
 */
export const ROOT_BRIDGE_AGENT_ACTION_BASE_GAS = {
  NO_ASSET_DEPOSIT: 100_000,
  SINGLE_ASSET_DEPOSIT: 150_000,
  MULTIPLE_ASSET_DEPOSIT: 200_000,
  SIGNED_NO_ASSET_DEPOSIT: 100_000,
  SIGNED_SINGLE_ASSET_DEPOSIT: 150_000,
  SIGNED_MULTIPLE_ASSET_DEPOSIT: 200_000,
  SIGNED_SINGLE_ASSET_DEPOSIT_WITH_FALLBACK: 290_000,
  SIGNED_MULTIPLE_ASSET_DEPOSIT_WITH_FALLBACK: 340_000,
  RETRY_SETTLEMENT: 100_000,
  RETRIEVE_DEPOSIT: 100_000,
  FALLBACK: 140_000,
} as const

/**
 * Holds the functions ids to be passed on the multicall calldata first byte.
 * ```
 *   0x01         | multicallNoOutput
 *   0x02         | multicallSingleOutput
 *   0x03         | multicallMultipleOutput
 *   0x04         | multicallSignedNoOutput
 *   0x05         | multicallSignedSingleOutput
 *   0x06         | multicallSignedMultipleOutput
 * ```
 * @param NO_OUTPUT - The multicall doesn't return any output.
 * @param SINGLE_OUTPUT - The multicall returns a single output.
 * @param MULTIPLE_OUTPUT - The multicall returns multiple outputs.
 * @param SIGNED_NO_OUTPUT - The multicall doesn't return any output and is using the virtual account.
 * @param SIGNED_SINGLE_OUTPUT - The multicall returns a single output and is using the virtual account.
 * @param SIGNED_MULTIPLE_OUTPUT - The multicall returns multiple outputs and is using the virtual account.
 */
export const MULTICALL_FUNCID = {
  NO_OUTPUT: '0x01',
  SINGLE_OUTPUT: '0x02',
  MULTIPLE_OUTPUT: '0x03',
  SIGNED_NO_OUTPUT: '0x04',
  SIGNED_SINGLE_OUTPUT: '0x05',
  SIGNED_MULTIPLE_OUTPUT: '0x06',
} as const

/**
 * Holds the default Supported Chain Id to gas params used in gas estimation
 */
export const DEFAULT_GAS_PARAMS: gasParamsMap = {
  // Mainnets
  [SupportedChainId.MAINNET]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e16).toString(),
  },
  [SupportedChainId.ARBITRUM_ONE]: {
    gasLimit: JSBI.BigInt(2000000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e16).toString(),
  },
  [SupportedChainId.OPTIMISM]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e16).toString(),
  },
  [SupportedChainId.BASE]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e16).toString(),
  },
  [SupportedChainId.POLYGON]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  // [SupportedChainId.FANTOM]: {
  //   gasLimit: JSBI.BigInt(600000).toString(),
  //   remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  // },
  [SupportedChainId.BSC]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e16).toString(),
  },
  [SupportedChainId.AVAX]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  [SupportedChainId.METIS]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e16).toString(),
  },

  // Testnets
  [SupportedChainId.SEPOLIA]: {
    gasLimit: JSBI.BigInt(2000000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  [SupportedChainId.ARBITRUM_SEPOLIA]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  [SupportedChainId.OPTIMISM_SEPOLIA]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  [SupportedChainId.BASE_SEPOLIA]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  [SupportedChainId.POLYGON_AMOY]: {
    gasLimit: JSBI.BigInt(600000).toString(),
    remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  },
  // [SupportedChainId.FANTOM_TESTNET]: {
  //   gasLimit: JSBI.BigInt(600000).toString(),
  //   remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  // },
  // [SupportedChainId.BSC_TESTNET]: {
  //   gasLimit: JSBI.BigInt(600000).toString(),
  //   remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  // },
  // [SupportedChainId.AVAX_FUJI]: {
  //   gasLimit: JSBI.BigInt(600000).toString(),
  //   remoteBranchExecutionGas: JSBI.BigInt(1e17).toString(),
  // },
}
