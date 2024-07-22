import { GasParams, IMulticallCall, IMultipleDepositParams, IPayableCall, ISingleDepositParams } from '../types'

export function formatCall(call: IMulticallCall) {
  return [call.target, call.callData]
}

export function formatCalls(calls: IMulticallCall[]) {
  return calls.map((call) => [call.target, call.callData])
}

export function formatPayableCall(call: IPayableCall) {
  return [call.target, call.callData, call.value]
}

export function formatPayableCalls(calls: IPayableCall[]) {
  return calls.map((call) => [call.target, call.callData, call.value])
}

export function formatGasParams(gasParams: GasParams) {
  return [gasParams.gasLimit, gasParams.remoteBranchExecutionGas]
}

export function formatGasParamsArray(gasParams: GasParams[]) {
  return gasParams.map((gasParam) => [gasParam.gasLimit, gasParam.remoteBranchExecutionGas])
}

export function formatDeposit(depositParams: ISingleDepositParams) {
  return [depositParams.hToken, depositParams.token, depositParams.amount, depositParams.deposit]
}

export function formatMultipleDeposit(depositParams: IMultipleDepositParams) {
  return [depositParams.hTokens, depositParams.tokens, depositParams.amounts, depositParams.deposits]
}
