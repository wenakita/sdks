import JSBI from 'jsbi'
import { SupportedChainId, Ulysses, ZERO, ZERO_ADDRESS } from 'maia-core-sdk'
import {
  BranchBridgeAgent,
  EVM_CHAIN_ID_TO_ROOT_CHAIN_ID,
  GasParams,
  IMulticallCall,
  IMultipleDepositParams,
  IOutputMultipleTokenParams,
  IOutputTokenParams,
  IPayableCall,
  ISingleDepositParams,
  ITokenOutputParams,
  ITokenParams,
  RootRouter,
  VirtualAccount,
} from 'ulysses-sdk'

import { IAction, IActionResult } from '../action'

export interface IContextParameters {
  chainId: SupportedChainId
  useVirtualAccount: boolean
  userAccount?: string
  value?: string
  gasParams?: GasParams
  inputTokens?: ITokenParams
  outputTokens?: ITokenOutputParams
}

// Interface for a context object that will be used an ActionBuilder object to execute one or more Actions.
export interface IActionContext<TParams, TResult> {
  // Function to encode one or more actions into a batch of onchain calls
  encodeAction(action: IAction<TParams, TResult>, params: TParams): IActionResult<TResult>
  // Function to wrap the calls for one or more actions into one cross-chain call
  wrapCalldata(results: IActionResult<TResult>[]): IActionResult<TResult>
  // Connected chain ID
  chainId: SupportedChainId
  // Virtual Account details
  useVirtualAccount?: boolean
  userAccount?: string
  // Transaction details
  value?: string
  // Cross-chain transaction details
  gasParams?: GasParams
  inputTokens?: ITokenParams // Define if action requires a token deposit
  outputTokens?: ITokenOutputParams // Define if action outputs tokens (no token, single token, or multiple tokens)
}

export class ContextHandler<TParams, TResult> implements IActionContext<TParams, TResult> {
  // This is the context that will be used to determine how to encode incoming actions
  chainId: SupportedChainId
  useVirtualAccount: boolean
  userAccount?: string | undefined
  value?: string | undefined
  gasParams?: GasParams | undefined
  inputTokens?: ITokenParams | undefined
  outputTokens?: ITokenOutputParams | undefined

  // This is the constructor for the context handler
  constructor(params: IContextParameters) {
    this.chainId = params.chainId
    this.useVirtualAccount = params.useVirtualAccount
    this.userAccount = params.userAccount
    this.value = params.value
    this.gasParams = params.gasParams
    this.inputTokens = params.inputTokens
    this.outputTokens = params.outputTokens
  }

  encodeAction(action: IAction<any, any>, params: any): IActionResult<any> {
    return action.encode(params)
  }

  wrapCalldata(results: IActionResult<TResult>[]): IActionResult<TResult> {
    // Prepare the calldata
    let calldata = ''

    const rootChainId = EVM_CHAIN_ID_TO_ROOT_CHAIN_ID[this.chainId]

    //---Wrap or adjust calldata for root chain virtual account usage
    if (this.chainId === rootChainId && this.useVirtualAccount) {
      // Root Action with no settlement creation
      if (!this.gasParams && !this.outputTokens) {
        // Wrap encode a Payable interaction via Virtual Account
        if (this.isPayableContext()) {
          // Encode the array of results into an array of IPayableCall type
          const calls: IPayableCall[] = results.map((result) => {
            return {
              target: result.target,
              callData: result.params.calldata,
              value: result.params.value,
            }
          })
          // Wrap the array of IPayableCall into a single calldata for direct Virtual Account usage
          calldata = VirtualAccount.encodePayableCall(calls)
          // Wrap encode a standard Multicall interaction via Virtual Account
        } else {
          // Encode the array of results into an array of IMulticallCall type
          const calls: IMulticallCall[] = results.map((result) => {
            return {
              target: result.target,
              callData: result.params.calldata,
            }
          })
          // Wrap the array of IMulticallCall into a single calldata for direct Virtual Account usage
          calldata = VirtualAccount.encodeMulticall(calls)
        }
        // Return the call information for direct Virtual Account usage
        return {
          target: this.userAccount ?? ZERO_ADDRESS,
          params: { calldata, value: this.value },
        } as IActionResult<TResult> // This would be the modified calldata based on the context
        // Root Action with settlement or multiple settlement creation
      } else {
        // Encode the array of results into an array of IPayableCall type
        const calls: IPayableCall[] = results.map((result) => {
          return {
            target: result.target,
            callData: result.params.calldata,
            value: result.params.value,
          }
        })

        // Wrap calldata inside Root Router Params
        let settlementCalldata = ''

        // Adjust encode for an interaction with single token output
        if (this.isOutputTokenParams(this.outputTokens)) {
          settlementCalldata = RootRouter.encodeCallOutAndBridgeCalldata({
            settlementOwnerAndGasRefundee: this.outputTokens.settlementOwner,
            ...this.outputTokens,
          })

          // Adjust encode for a multiple token output interaction
        } else if (this.isOutputMultipleTokenParams(this.outputTokens)) {
          settlementCalldata = RootRouter.encodeCallOutAndBridgeMultipleCalldata({
            settlementOwnerAndGasRefundee: this.outputTokens.settlementOwner,
            ...this.outputTokens,
          })
        }

        // Add the settlement calldata to the calls array
        calls.push({
          target: Ulysses[this.chainId]?.MulticallRootRouterLibZip ?? ZERO_ADDRESS,
          callData: settlementCalldata,
          value: this.value ?? '0',
        })

        return {
          target: this.userAccount ?? ZERO_ADDRESS,
          params: {
            calldata: VirtualAccount.encodePayableCallWithoutCompression(calls),
            value: '0', // TODO: Check HOW WE CAN GET SUM OF VALUE HERE
          },
        } as IActionResult<TResult>
      }

      //---Wrap or adjust calldata for branch chain usage of Branch Bridge Agent
    } else {
      // Encode the array of results into an array of IMulticallCall type
      const calls: IMulticallCall[] = results.map((result) => {
        return {
          target: result.target,
          callData: result.params.calldata,
        }
      })

      // Wrap calldata inside Root Router Params
      // Adjust encode for an interaction that doesn't require a token output
      if (!this.outputTokens) {
        calldata = RootRouter.encodeRemoteMulticallNoOutput(calls)
        // Adjust encode for a single token output interaction
      } else if (this.isOutputTokenParams(this.outputTokens)) {
        calldata = RootRouter.encodeRemoteMulticallWithOutput(calls, this.outputTokens)
        // Adjust encode for a multiple token output interaction
      } else if (this.isOutputMultipleTokenParams(this.outputTokens)) {
        calldata = RootRouter.encodeRemoteMulticallWithMultipleOutput(calls, this.outputTokens)
      }

      // Prepare the calldata for the Branch Bridge Agent
      let result: { calldata: string; value: string } = { calldata: '', value: '0' }

      // Wrap calldata inside Branch Bridge Agent Params
      // Adjust encode for an interaction that doesn't require a token
      if (!this.inputTokens) {
        result = BranchBridgeAgent.encodeCallOutSignedLibZipCalldata(
          calldata,
          this.gasParams ?? { gasLimit: ZERO.toString(), remoteBranchExecutionGas: ZERO.toString() }
        )
        // Adjust encode for a single deposit interaction
      } else if (this.isSingleDepositParams(this.inputTokens)) {
        result = BranchBridgeAgent.encodeCallOutSignedAndBridgeLibZipCalldata(
          calldata,
          this.inputTokens,
          this.gasParams ?? { gasLimit: ZERO.toString(), remoteBranchExecutionGas: ZERO.toString() }
        )
        // Adjust encode for a multiple deposit interaction
      } else if (this.isMultipleDepositParams(this.inputTokens)) {
        result = BranchBridgeAgent.encodeCallOutSignedAndBridgeMultipleLibZipCalldata(
          calldata,
          this.inputTokens,
          this.gasParams ?? { gasLimit: ZERO.toString(), remoteBranchExecutionGas: ZERO.toString() }
        )
      }
      return {
        target: Ulysses[this.chainId]?.MulticallBranchBridgeAgentLibZip ?? ZERO_ADDRESS,
        params: { calldata: result.calldata, value: result.value },
      } as IActionResult<TResult>
    }
  }

  private isPayableContext(): boolean {
    return this.value !== undefined && JSBI.greaterThan(JSBI.BigInt(this.value), JSBI.BigInt('0'))
  }

  private isOutputTokenParams(params: any): params is IOutputTokenParams {
    return (
      params &&
      'settlementOwner' in params &&
      typeof params.settlementOwner === 'string' &&
      'recipient' in params &&
      typeof params.recipient === 'string' &&
      'outputToken' in params &&
      typeof params.outputToken === 'string' &&
      'amountOut' in params &&
      typeof params.amountOut === 'string' &&
      'depositOut' in params &&
      typeof params.depositOut === 'string' &&
      'dstChainId' in params &&
      typeof params.dstChainId === 'number' &&
      'gasParams' in params &&
      typeof params.gasParams === 'object' &&
      typeof params.gasParams.gasLimit === 'string' &&
      typeof params.gasParams.remoteBranchExecutionGas === 'string'
    )
  }

  private isOutputMultipleTokenParams(params: any): params is IOutputMultipleTokenParams {
    return (
      params &&
      'settlementOwner' in params &&
      typeof params.settlementOwner === 'string' &&
      'recipient' in params &&
      typeof params.recipient === 'string' &&
      'outputTokens' in params &&
      Array.isArray(params.outputTokens) &&
      'amountsOut' in params &&
      Array.isArray(params.amountsOut) &&
      'depositsOut' in params &&
      Array.isArray(params.depositsOut) &&
      'dstChainId' in params &&
      typeof params.dstChainId === 'number' &&
      'gasParams' in params &&
      typeof params.gasParams === 'object' &&
      typeof params.gasParams.gasLimit === 'string' &&
      typeof params.gasParams.remoteBranchExecutionGas === 'string'
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
