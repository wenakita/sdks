import { BigNumber } from '@ethersproject/bignumber'

type ChainConfig = {
  router: string
  quoter: string
  creationBlock: number
  weth: string
  steth: string
  wsteth: string
}

export const NOT_SUPPORTED_ON_CHAIN = '0x0000000000000000000000000000000000000000'

const CHAIN_CONFIGS: { [key: number]: ChainConfig } = {
  // mainnet
  [1]: {
    router: NOT_SUPPORTED_ON_CHAIN,
    quoter: NOT_SUPPORTED_ON_CHAIN,
    weth: NOT_SUPPORTED_ON_CHAIN,
    steth: NOT_SUPPORTED_ON_CHAIN,
    wsteth: NOT_SUPPORTED_ON_CHAIN,
    creationBlock: 0,
  },
  // sepolia
  [11155111]: {
    router: '0x5181bd48C2070E1f850C4a1F59665f02E4617Cb0',
    quoter: '0x039e7Db104500818f414dd65860480A4ed41fB20',
    weth: NOT_SUPPORTED_ON_CHAIN,
    steth: NOT_SUPPORTED_ON_CHAIN,
    wsteth: NOT_SUPPORTED_ON_CHAIN,
    creationBlock: 0,
  },
  //optimism
  [10]: {
    router: NOT_SUPPORTED_ON_CHAIN,
    quoter: NOT_SUPPORTED_ON_CHAIN,
    weth: NOT_SUPPORTED_ON_CHAIN,
    steth: NOT_SUPPORTED_ON_CHAIN,
    wsteth: NOT_SUPPORTED_ON_CHAIN,
    creationBlock: 0,
  },
  // arbitrum
  [42161]: {
    router: '0x0000000003Af65ffb293E722e9Fe41e9C15ABB3D',
    quoter: '0xE8d9dfF5807c6F832CBC41322aE4ca625f99d34d',
    weth: NOT_SUPPORTED_ON_CHAIN,
    steth: NOT_SUPPORTED_ON_CHAIN,
    wsteth: NOT_SUPPORTED_ON_CHAIN,
    creationBlock: 0,
  },
}

export const UNIVERSAL_ROUTER_ADDRESS = (chainId: number): string => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].router
}

export const UNIVERSAL_ROUTER_CREATION_BLOCK = (chainId: number): number => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].creationBlock
}

export const WETH_ADDRESS = (chainId: number): string => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)

  if (CHAIN_CONFIGS[chainId].weth == NOT_SUPPORTED_ON_CHAIN) throw new Error(`Chain ${chainId} does not have WETH`)

  return CHAIN_CONFIGS[chainId].weth
}

export const STETH_ADDRESS = (chainId: number): string => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)

  if (CHAIN_CONFIGS[chainId].steth == NOT_SUPPORTED_ON_CHAIN)
    throw new Error(`Chain ${chainId} does not have STETH support`)

  return CHAIN_CONFIGS[chainId].steth
}

export const WSTETH_ADDRESS = (chainId: number): string => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)

  if (CHAIN_CONFIGS[chainId].wsteth == NOT_SUPPORTED_ON_CHAIN)
    throw new Error(`Chain ${chainId} does not have WSTETH support`)

  return CHAIN_CONFIGS[chainId].wsteth
}

export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'

export const MAX_LIMIT_BALANCER = BigNumber.from(2).pow(254)
export const CONTRACT_BALANCE = BigNumber.from(2).pow(255)
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1)
export const MAX_UINT160 = BigNumber.from(2).pow(160).sub(1)

export const SENDER_AS_RECIPIENT = '0x0000000000000000000000000000000000000001'
export const ROUTER_AS_RECIPIENT = '0x0000000000000000000000000000000000000002'

export const OPENSEA_CONDUIT_SPENDER_ID = 0
export const SUDOSWAP_SPENDER_ID = 1
export const BALANCER_VAULT_ID = 2
