import { SupportedChainId } from '../../constants'
import { IProtocolAddresses } from '../basic'

// Common contracts for Ulysses Omnichain.
export interface IUlyssesCommonContracts extends IProtocolAddresses {
  BranchPort: string
  BranchBridgeAgentFactory: string
  CoreBranchRouter: string
  CoreBranchBridgeAgent: string
  ERC20hTokenBranchFactory: string
  MulticallBranchRouter: string
  MulticallBranchBridgeAgent: string
  MulticallBranchRouterLibZip: string
  MulticallBranchBridgeAgentLibZip: string
  NativeToken: string
}

// Contracts specific to Ulysses Omnichain on Arbitrum.
export interface IUlyssesArbitrumContracts extends IUlyssesCommonContracts {
  RootPort: string
  RootBridgeAgentFactory: string
  CoreRootRouter: string
  CoreRootBridgeAgent: string
  ERC20hTokenRootFactory: string
  MulticallRootRouter: string
  MulticallRootBridgeAgent: string
  MulticallRootRouterLibZip: string
  MulticallRootBridgeAgentLibZip: string
}

// Ulysses Omnichain definition.
export type IUlysses = {
  [key in SupportedChainId]?: key extends 42161
    ? IUlyssesArbitrumContracts
    : key extends 11155111
    ? IUlyssesArbitrumContracts
    : IUlyssesCommonContracts
}
