import { pack } from '@ethersproject/solidity'
import { LZ_CHAIN_ID_FROM_EVM_CHAIN_ID, ZERO, ZERO_ADDRESS } from 'maia-core-sdk'
import {
  BRANCH_BRIDGE_AGENT_ACTION_BASE_GAS,
  DEFAULT_GAS_PARAMS,
  IMultipleDepositParams,
  IMultipleSettlementParams,
  ISingleDepositParams,
  ISingleSettlementParams,
  ITokenDepositParams,
  ITokenSettlementParams,
  LzEndpoint,
  ROOT_BRIDGE_AGENT_ACTION_BASE_GAS,
} from 'ulysses-sdk'

/**
 * A step in a cross-chain transaction path. (e.g. Source Chain -> Root Chain -> Destination Chain amount to 3 steps).
 * @param to The recipient's address for the transaction.
 * @param calldata The transaction data (e.g., encoded function call).
 * @param provider The target chain ether provider object to use (`providers.JsonRpcProvider`).
 * @param chainId The target chain id.
 */
export interface StepData {
  to: string // The recipient's address for the transaction
  calldata: string // The transaction data (e.g., encoded function call)
  baseGas: string // The base gas cost for step cost based off action type
  chainId: number // The target chain id
}

/**
 * Encodes the calldata for a Layer Zero endpoint.
 */
export class LayerZeroEndpointCalldataEncoder {
  private useVirtualAccount: boolean
  private useFallback: boolean
  private useRootAsOrigin: boolean
  private rootChainId: number
  private originChainId: number
  private dstChainId?: number | undefined
  private branchBridgeAgentAddress?: string | undefined
  private rootBridgeAgentAddress?: string | undefined
  private destinationBridgeAgentAddress?: string | undefined
  private branchBridgeAgentNonce?: number | undefined
  private rootBridgeAgentNonce?: number | undefined
  private destinationBridgeAgentNonce?: number | undefined
  private rootRouterParams?: string | undefined
  private destinationRouterParams?: string | undefined
  private depositTokens?: ITokenDepositParams
  private settlementTokens?: ITokenSettlementParams
  private settlementOverrideAmounts?: string[]
  private account?: string | undefined
  private settlementRecipient?: string | undefined
  private settlementOwnerAndRefundee?: string | undefined

  private rootChainIdLz: number
  private originChainIdLz: number
  private dstChainIdLz?: number | undefined

  constructor(
    useVirtualAccount: boolean,
    useFallback: boolean,
    useRootAsOrigin: boolean,
    rootChainId: number,
    originChainId: number,
    dstChainId?: number | undefined,
    branchBridgeAgentAddress?: string | undefined,
    rootBridgeAgentAddress?: string | undefined,
    destinationBridgeAgentAddress?: string | undefined,
    branchBridgeAgentNonce?: number | undefined,
    rootBridgeAgentNonce?: number | undefined,
    destinationBridgeAgentNonce?: number | undefined,
    rootRouterParams?: string | undefined,
    destinationRouterParams?: string | undefined,
    depositTokens?: ITokenDepositParams | undefined,
    settlementTokens?: ITokenSettlementParams | undefined,
    settlementOverrideAmounts?: string[],
    account?: string | undefined,
    settlementRecipient?: string | undefined,
    settlementOwnerAndRefundee?: string | undefined
  ) {
    this.useVirtualAccount = useVirtualAccount
    this.useFallback = useFallback
    this.useRootAsOrigin = useRootAsOrigin
    this.rootChainId = rootChainId
    this.originChainId = originChainId
    this.dstChainId = dstChainId
    this.branchBridgeAgentAddress = branchBridgeAgentAddress
    this.rootBridgeAgentAddress = rootBridgeAgentAddress
    this.destinationBridgeAgentAddress = destinationBridgeAgentAddress
    this.branchBridgeAgentNonce = branchBridgeAgentNonce
    this.rootBridgeAgentNonce = rootBridgeAgentNonce
    this.destinationBridgeAgentNonce = destinationBridgeAgentNonce
    this.rootRouterParams = rootRouterParams
    this.destinationRouterParams = destinationRouterParams
    this.depositTokens = depositTokens
    this.settlementTokens = settlementTokens
    this.settlementOverrideAmounts = settlementOverrideAmounts
    this.account = account
    this.settlementRecipient = settlementRecipient
    this.settlementOwnerAndRefundee = settlementOwnerAndRefundee

    this.rootChainIdLz = LZ_CHAIN_ID_FROM_EVM_CHAIN_ID[rootChainId]
    this.originChainIdLz = LZ_CHAIN_ID_FROM_EVM_CHAIN_ID[originChainId]
    this.dstChainIdLz = dstChainId ? LZ_CHAIN_ID_FROM_EVM_CHAIN_ID[dstChainId] : undefined

    this.validateParameters()
  }

  validateParameters(): void {
    if (this.useVirtualAccount === undefined) {
      throw new Error('Use virtual account parameter is required')
    }

    if (this.useFallback === undefined) {
      throw new Error('Use fallback parameter is required')
    }

    if (this.useRootAsOrigin === undefined) {
      throw new Error('Use root as origin parameter is required')
    }

    if (this.rootChainId === undefined || this.rootChainId <= 0) {
      throw new Error('Invalid root chain ID')
    }

    if (this.originChainId === undefined || this.originChainId <= 0) {
      throw new Error('Invalid origin chain ID')
    }

    if (this.dstChainId !== undefined && this.dstChainId <= 0) {
      throw new Error('Invalid destination chain ID')
    }

    if (this.rootBridgeAgentAddress === undefined) {
      throw new Error('Root bridge agent address is required')
    }

    if (this.branchBridgeAgentAddress === undefined && this.destinationBridgeAgentAddress === undefined) {
      throw new Error('Destination branch bridge agent address is required')
    }

    if (this.rootBridgeAgentNonce === undefined) {
      throw new Error('Root bridge agent nonce is required')
    }

    if (this.branchBridgeAgentNonce === undefined && this.destinationBridgeAgentNonce === undefined) {
      throw new Error('Destination branch bridge agent nonce is required')
    }

    if (this.useVirtualAccount && this.account === undefined) {
      throw new Error('User account is required for virtual account usage')
    }

    if (
      this.settlementTokens &&
      (this.settlementRecipient === undefined || this.settlementOwnerAndRefundee === undefined)
    ) {
      throw new Error('Settlement recipient and owner/refundee are required for settlement tokens')
    }
  }

  encode(): StepData[] {
    let entryBridgeAgentAddress: string
    let entryChainId: number
    const steps: StepData[] = []

    // Step 1: Origin Chain is Root Chain
    if (this.useRootAsOrigin) {
      // Set entry bridge agent address and entry chain id
      entryBridgeAgentAddress = this.rootBridgeAgentAddress ?? ''
      entryChainId = this.rootChainId

      // Perform input checks
      if (
        !this.settlementRecipient ||
        !this.useFallback ||
        !this.branchBridgeAgentNonce ||
        !this.destinationBridgeAgentAddress ||
        !this.rootBridgeAgentAddress ||
        !this.dstChainId ||
        !this.dstChainIdLz
      ) {
        return steps
      }

      // Encode calldata for destination branch chain
      const dstCalldata = this.encodeCalldataForBranchChain(
        this.settlementRecipient,
        this.settlementOwnerAndRefundee ?? ZERO_ADDRESS,
        this.useFallback,
        this.rootBridgeAgentNonce ?? 0,
        this.destinationBridgeAgentAddress ?? '',
        this.rootBridgeAgentAddress ?? '',
        this.dstChainId,
        this.dstChainIdLz,
        this.destinationRouterParams,
        this.settlementTokens,
        this.settlementOverrideAmounts
      )

      // Add destination branch chain calldata to steps
      steps.push(...dstCalldata)

      // Step 1: Origin Chain is a Branch Chain
    } else {
      // Set entry bridge agent address and entry chain id
      entryBridgeAgentAddress = this.branchBridgeAgentAddress ?? ''
      entryChainId = this.originChainId

      // Perform input checks
      if (
        !this.useVirtualAccount ||
        !this.account ||
        !this.useFallback ||
        !this.rootBridgeAgentNonce ||
        !this.rootBridgeAgentAddress ||
        !this.branchBridgeAgentAddress ||
        !this.originChainId ||
        !this.originChainIdLz
      ) {
        return steps
      }

      // Encode calldata for root chain
      const rootCalldata = this.encodeCalldataForRootChain(
        this.useVirtualAccount,
        this.account,
        this.useFallback,
        this.branchBridgeAgentNonce ?? 0,
        this.branchBridgeAgentAddress,
        this.rootBridgeAgentAddress,
        this.originChainId,
        this.originChainIdLz,
        this.rootRouterParams,
        this.depositTokens
      )

      // Add root chain calldata to steps
      steps.push(...rootCalldata)
    }

    // Step 2: Root Chain -> Destination Chain (if destination chain exists)
    if (!this.useRootAsOrigin && this.dstChainId && this.dstChainId !== this.rootChainId) {
      // Encode calldata for execution after second hop/step to destination branch chain
      const dstCalldata = this.encodeCalldataForBranchChain(
        this.settlementRecipient ?? ZERO_ADDRESS,
        this.settlementOwnerAndRefundee ?? ZERO_ADDRESS,
        this.useFallback,
        this.rootBridgeAgentNonce ?? 0,
        this.destinationBridgeAgentAddress ?? '',
        this.rootBridgeAgentAddress ?? '',
        this.dstChainId,
        this.dstChainIdLz,
        this.destinationRouterParams,
        this.settlementTokens,
        this.settlementOverrideAmounts
      )

      // Add destination branch chain calldata to steps
      steps.push(...dstCalldata)

      // Step 2: Origin Chain -> Root Chain (if origin chain is root chain and destination chain exists)
    } else if (this.useRootAsOrigin && this.dstChainId && this.dstChainId === this.rootChainId && this.account) {
      // Encode calldata for execution after second hop/step to root chain
      const rootCalldata = this.encodeCalldataForRootChain(
        this.useVirtualAccount,
        this.account,
        this.useFallback,
        this.destinationBridgeAgentNonce ?? 0,
        this.destinationBridgeAgentAddress ?? '',
        this.rootBridgeAgentAddress ?? '',
        this.originChainId,
        this.originChainIdLz,
        this.rootRouterParams,
        this.depositTokens
      )
      steps.push(...rootCalldata)
    }

    return [{ to: entryBridgeAgentAddress, calldata: '', baseGas: ZERO.toString(), chainId: entryChainId }, ...steps]
  }

  encodeCalldataForRootChain(
    useVirtualAccount: boolean,
    account: string,
    useFallback: boolean,
    branchBridgeAgentNonce: number,
    branchBridgeAgentAddress: string,
    rootBridgeAgentAddress: string,
    _originChainId: number,
    originChainIdLz: number,
    rootRouterParams?: string | undefined,
    depositTokens?: ITokenDepositParams | undefined
  ): StepData[] {
    let calldata = ''
    let baseGas = ZERO.toString()

    // Logic to encode calldata for root chain execution

    // Step 1: If there are no deposit tokens, then encode calldata for createCallOutLzEndpointCalldata
    if (!depositTokens) {
      if (!useVirtualAccount) {
        calldata = LzEndpoint.createCallOutLzEndpointCalldata(
          originChainIdLz,
          pack(['address', 'address'], [branchBridgeAgentAddress, rootBridgeAgentAddress]),
          branchBridgeAgentNonce,
          rootRouterParams ?? '0x'
        )
        baseGas = ROOT_BRIDGE_AGENT_ACTION_BASE_GAS.NO_ASSET_DEPOSIT.toString()
      } else {
        calldata = LzEndpoint.createBranchCallOutSignedLzEndpointCalldata(
          originChainIdLz,
          pack(['address', 'address'], [branchBridgeAgentAddress, rootBridgeAgentAddress]),
          branchBridgeAgentNonce,
          account,
          rootRouterParams ?? '0x'
        )
        baseGas = ROOT_BRIDGE_AGENT_ACTION_BASE_GAS.SIGNED_NO_ASSET_DEPOSIT.toString()
      }
    } else if (this.isSingleDepositParams(depositTokens)) {
      if (!useVirtualAccount) {
        calldata = LzEndpoint.createCallOutAndBridgeLzEndpointCalldata(
          originChainIdLz,
          pack(['address', 'address'], [branchBridgeAgentAddress, rootBridgeAgentAddress]),
          branchBridgeAgentNonce,
          {
            params: rootRouterParams ?? '0x',
            depositParams: depositTokens,
            gasParams: {
              gasLimit: '', // Placeholders to preserve interface
              remoteBranchExecutionGas: '', // Placeholders to preserve interface
            },
          }
        )
        baseGas = ROOT_BRIDGE_AGENT_ACTION_BASE_GAS.SINGLE_ASSET_DEPOSIT.toString()
      } else {
        calldata = LzEndpoint.createBranchCallOutSignedAndBridgeLzEndpointCalldata(
          originChainIdLz,
          pack(['address', 'address'], [branchBridgeAgentAddress, rootBridgeAgentAddress]),
          branchBridgeAgentNonce,
          account,
          {
            params: rootRouterParams ?? '0x',
            depositParams: depositTokens,
            gasParams: {
              gasLimit: '', // Placeholders to preserve interface
              remoteBranchExecutionGas: '', // Placeholders to preserve interface
            },
            hasFallbackToggled: useFallback,
          }
        )
        baseGas = ROOT_BRIDGE_AGENT_ACTION_BASE_GAS.SIGNED_SINGLE_ASSET_DEPOSIT_WITH_FALLBACK.toString()
      }
    } else if (this.isMultipleDepositParams(depositTokens)) {
      if (!useVirtualAccount) {
        calldata = LzEndpoint.createBranchCallOutAndBridgeMultipleLzEndpointCalldata(
          originChainIdLz,
          pack(['address', 'address'], [branchBridgeAgentAddress, rootBridgeAgentAddress]),
          branchBridgeAgentNonce,
          {
            params: rootRouterParams ?? '0x',
            depositParams: depositTokens,
            gasParams: {
              gasLimit: '', // Placeholders to preserve interface
              remoteBranchExecutionGas: '', // Placeholders to preserve interface
            },
          }
        )
        baseGas = ROOT_BRIDGE_AGENT_ACTION_BASE_GAS.MULTIPLE_ASSET_DEPOSIT.toString()
      } else {
        calldata = LzEndpoint.createBranchCallOutSignedAndBridgeMultipleLzEndpointCalldata(
          originChainIdLz,
          pack(['address', 'address'], [branchBridgeAgentAddress, rootBridgeAgentAddress]),
          branchBridgeAgentNonce,
          account,
          {
            params: rootRouterParams ?? '0x',
            depositParams: depositTokens,
            gasParams: {
              gasLimit: '', // Placeholders to preserve interface
              remoteBranchExecutionGas: '', // Placeholders to preserve interface
            },
            hasFallbackToggled: useFallback,
          }
        )
        baseGas = ROOT_BRIDGE_AGENT_ACTION_BASE_GAS.SIGNED_MULTIPLE_ASSET_DEPOSIT_WITH_FALLBACK.toString()
      }
    }
    return [
      {
        to: rootBridgeAgentAddress,
        calldata,
        baseGas,
        chainId: this.rootChainId,
      },
    ]
  }

  encodeCalldataForBranchChain(
    recipient: string,
    settlementOwnerAndGasRefundee: string,
    useFallback: boolean,
    rootBridgeAgentNonce: number,
    branchBridgeAgentAddress: string,
    rootBridgeAgentAddress: string,
    dstChainId?: number | undefined,
    dstChainIdLz?: number | undefined,
    destinationRouterParams?: string | undefined,
    settlementTokens?: ITokenSettlementParams | undefined,
    settlementOverrideAmounts?: string[]
  ): StepData[] {
    let calldata = ''
    let baseGas = ZERO.toString()

    // Logic to encode calldata for branch chain execution

    // Step 1: If there are no settlement tokens, then encode calldata for createCallOutLzEndpointCalldata
    if (!settlementTokens) {
      calldata = LzEndpoint.createRootCallOutLzEndpointCalldata(
        this.rootChainIdLz,
        pack(['address', 'address'], [rootBridgeAgentAddress, branchBridgeAgentAddress]),
        rootBridgeAgentNonce,
        recipient,
        destinationRouterParams ?? '0x'
      )
      baseGas = BRANCH_BRIDGE_AGENT_ACTION_BASE_GAS.NO_ASSET_DEPOSIT.toString()
    } else if (this.isSingleSettlementParams(settlementTokens)) {
      calldata = LzEndpoint.createRootCallOutAndBridgeLzEndpointCalldata(
        this.rootChainIdLz,
        pack(['address', 'address'], [rootBridgeAgentAddress, branchBridgeAgentAddress]),
        rootBridgeAgentNonce,
        {
          settlementOwnerAndGasRefundee,
          recipient,
          params: destinationRouterParams ?? '0x',
          settlementParams: {
            hToken: settlementTokens.hToken,
            token: settlementTokens.token,
            amount: settlementOverrideAmounts?.[0] ?? settlementTokens.amount,
            deposit: settlementOverrideAmounts?.[0] ?? settlementTokens.deposit,
          },
          gasParams: {
            gasLimit: DEFAULT_GAS_PARAMS[dstChainId ?? 0].gasLimit,
            remoteBranchExecutionGas: DEFAULT_GAS_PARAMS[dstChainId ?? 0].remoteBranchExecutionGas,
          },
          hasFallbackToggled: useFallback,
          dstChainId: dstChainIdLz ?? 0,
        }
      )
      baseGas = BRANCH_BRIDGE_AGENT_ACTION_BASE_GAS.SINGLE_ASSET_DEPOSIT_WITH_FALLBACK.toString()
    } else if (this.isMultipleSettlementParams(settlementTokens)) {
      calldata = LzEndpoint.createRootCallOutAndBridgeMultipleLzEndpointCalldata(
        this.rootChainIdLz,
        pack(['address', 'address'], [rootBridgeAgentAddress, branchBridgeAgentAddress]),
        rootBridgeAgentNonce,
        {
          settlementOwnerAndGasRefundee,
          recipient,
          params: destinationRouterParams ?? '0x',
          settlementParams: {
            hTokens: settlementTokens.hTokens,
            tokens: settlementTokens.tokens,
            amounts: settlementOverrideAmounts ?? settlementTokens.amounts,
            deposits: settlementOverrideAmounts ?? settlementTokens.deposits,
          },
          gasParams: {
            gasLimit: DEFAULT_GAS_PARAMS[dstChainId ?? 0].gasLimit,
            remoteBranchExecutionGas: DEFAULT_GAS_PARAMS[dstChainId ?? 0].remoteBranchExecutionGas,
          },
          hasFallbackToggled: useFallback,
          dstChainId: dstChainIdLz ?? 0,
        }
      )
      baseGas = BRANCH_BRIDGE_AGENT_ACTION_BASE_GAS.MULTIPLE_ASSET_DEPOSIT_WITH_FALLBACK.toString()
    }

    return [
      {
        to: branchBridgeAgentAddress,
        calldata,
        baseGas,
        chainId: dstChainId ?? 0,
      },
    ]
  }

  private isSingleSettlementParams(params: any): params is ISingleSettlementParams {
    return (
      params &&
      'hToken' in params &&
      typeof params.hToken === 'string' &&
      'token' in params &&
      typeof params.token === 'string' &&
      'amount' in params &&
      typeof params.amount === 'string' &&
      'deposit' in params &&
      typeof params.deposit === 'string'
    )
  }

  private isMultipleSettlementParams(params: any): params is IMultipleSettlementParams {
    return (
      params &&
      'hTokens' in params &&
      Array.isArray(params.hTokens) &&
      'tokens' in params &&
      Array.isArray(params.tokens) &&
      'amounts' in params &&
      Array.isArray(params.amounts) &&
      'deposits' in params &&
      Array.isArray(params.deposits)
    )
  }

  private isSingleDepositParams(params: any): params is ISingleDepositParams {
    return (
      params &&
      'hToken' in params &&
      typeof params.hToken === 'string' &&
      'token' in params &&
      typeof params.token === 'string' &&
      'amount' in params &&
      typeof params.amount === 'string' &&
      'deposit' in params &&
      typeof params.deposit === 'string'
    )
  }

  private isMultipleDepositParams(params: any): params is IMultipleDepositParams {
    return (
      params &&
      'hTokens' in params &&
      Array.isArray(params.hTokens) &&
      'tokens' in params &&
      Array.isArray(params.tokens) &&
      'amounts' in params &&
      Array.isArray(params.amounts) &&
      'deposits' in params &&
      Array.isArray(params.deposits)
    )
  }
}
