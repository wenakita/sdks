import { TradeType, Vault } from 'hermes-v2-sdk'
import { Currency } from 'maia-core-sdk'

import { QuotePlanner } from '../../../utils/quoterCommands'
import { CommandType } from '../../../utils/routerCommands'
import { MixedEncodingParams, SingleEncodingParams } from '.'

export function addVaultQuote<TInput extends Currency, TOutput extends Currency>(
  planner: QuotePlanner,
  { route, amount, tradeType }: SingleEncodingParams<TInput, TOutput>
): void {
  if (route.pools.length === 1) {
    const vault = (route.pools[0] as Vault).vault()

    const params = [
      vault.address,
      tradeType == TradeType.EXACT_INPUT ? amount.quotient.toString() : amount.quotient.toString(),
    ]

    if (tradeType == TradeType.EXACT_INPUT) {
      planner.addCommand(
        amount.currency.wrapped === vault ? CommandType.ERC4626_DEPOSIT : CommandType.ERC4626_REDEEM,
        params
      )
    } else if (tradeType == TradeType.EXACT_OUTPUT) {
      planner.addCommand(
        amount.currency.wrapped === vault ? CommandType.ERC4626_MINT : CommandType.ERC4626_WITHDRAW,
        params
      )
    }
  } else {
    throw new Error('UNEXPECTED_ROUTE - depositing a erc4626 vault into another erc4626 vault is not supported yet')
  }
}

export function addVaultMixedQuote(planner: QuotePlanner, { route, amountIn }: MixedEncodingParams) {
  if (route.pools.length === 1) {
    const vault = (route.pools[0] as Vault).vault()

    const params = [vault.address, amountIn]

    planner.addCommand(route.input.wrapped === vault ? CommandType.ERC4626_DEPOSIT : CommandType.ERC4626_REDEEM, params)
  } else {
    throw new Error('UNEXPECTED_ROUTE - depositing a erc4626 vault into another erc4626 vault is not supported yet')
  }
}
