import JSBI from 'jsbi'
import { checkValidAddress, ZERO, ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { IMulticallCall, IMultipleDepositParams, IPayableCall, ISingleDepositParams } from '../types'

/**
 * Checks if the single deposit params are valid.
 * @param depositParams
 */
export function singleDepositInvariantHelper(depositParams: ISingleDepositParams) {
  invariant(checkValidAddress(depositParams.token), 'token must be a valid address')
  invariant(checkValidAddress(depositParams.hToken), 'token must be a valid address')
  invariant(depositParams.hToken !== ZERO_ADDRESS, 'hToken cannot be zero address')
  invariant(depositParams.hToken !== depositParams.token, 'hToken and token must be different')
  invariant(JSBI.BigInt(depositParams.amount) >= ZERO, 'Amount must be greater than ZERO')
  invariant(JSBI.BigInt(depositParams.deposit) >= ZERO, 'Deposit must be greater than ZERO')
  invariant(depositParams.amount >= depositParams.deposit, 'Amount must be greater than or equal to deposit')
}

/**
 * Checks if the multipledeposit params are valid.
 * @param depositParams
 */
export function multipleDepositInvariantHelper(depositParams: IMultipleDepositParams) {
  depositParams.tokens.forEach((token, index) => {
    invariant(checkValidAddress(token), 'token must be a valid address')
    invariant(JSBI.BigInt(depositParams.deposits[index]) >= ZERO, 'Deposit must be greater than 0')
    invariant(
      depositParams.amounts[index] >= depositParams.deposits[index],
      'Amount must be greater than or equal to deposit'
    )
  })

  depositParams.hTokens.forEach((hToken, index) => {
    invariant(checkValidAddress(hToken), 'htoken must be a valid address')
    invariant(hToken !== ZERO_ADDRESS, 'hToken cannot be zero address')
    invariant(hToken !== depositParams.tokens[index], 'hToken and token must be different')
    invariant(JSBI.BigInt(depositParams.amounts[index]) >= ZERO, 'Amount must be greater or equal than 0')
  })
}

/**
 * Invariant helper for the virtual account function that encodes multiple calls, either payable or not.
 * @param calls
 */
export function virtualAccountCallInvariantHelper(calls: Array<IPayableCall | IMulticallCall>) {
  invariant(calls.length > 0, 'Must have at least one call')
  calls.forEach((call) => {
    invariant(checkValidAddress(call.target), 'Target must be valid address')
    invariant(call.target !== '', 'Target must be defined')
    invariant(call.callData !== '', ' Call data must be defined')

    if ('value' in call) {
      invariant(JSBI.BigInt(call.value) >= ZERO, 'Value must be greater than or equal to 0')
    }
  })
}

export function virtualAccountWithdrawInvariantHelper(token: string, amount?: JSBI, tokenId?: JSBI) {
  invariant(checkValidAddress(token), 'Token must be valid address')
  invariant(token !== ZERO_ADDRESS, 'Token cannot be zero address')

  if (amount) {
    invariant(amount >= ZERO, 'Amount must be greater than or equal to 0')
  } else {
    invariant(tokenId, 'TokenId must be defined')
    invariant(tokenId >= ZERO, ' TokenId must be greater than or equal to 0')
  }
}
