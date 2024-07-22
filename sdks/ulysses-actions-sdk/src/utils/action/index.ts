import { MethodParameters } from 'maia-core-sdk'

// Interface for a contract action with a method to encode the calldata for the action.
export interface IAction<TParams, TResult> {
  params: TParams
  additionalData?: any
  encode(params: TParams, additionalData?: IActionResult<any>[]): IActionResult<TResult>
}

// Type containing the encoded calldata and transaction value for an onchain transaction.
export interface IActionResult<TValue> {
  target: string
  params: MethodParameters
  additionalData?: TValue
}
