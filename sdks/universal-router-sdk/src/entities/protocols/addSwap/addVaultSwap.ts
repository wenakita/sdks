import { RouteStableWrapper } from 'hermes-swap-router-sdk'
import { Trade as V3Trade, TradeType, Vault } from 'hermes-v2-sdk'
import { Currency } from 'maia-core-sdk'

import { CONTRACT_BALANCE, ROUTER_AS_RECIPIENT } from '../../../utils/constants'
import { CommandType, RoutePlanner } from '../../../utils/routerCommands'
import { Swap } from '../uniswap'
import { EncodingParams, MixedEncodingParams } from './addMixedSwap'

export function addVaultSwap<TInput extends Currency, TOutput extends Currency>(
  planner: RoutePlanner,
  { swap, tradeType, options, payerIsUser, routerMustCustody, useContractBalance }: EncodingParams<TInput, TOutput>
): void {
  const { route, inputAmount, outputAmount }: Swap<TInput, TOutput> = swap

  // TODO: Add general support for all ERC4626 type vaults (don't explcitly use RouteStableWrapper here)
  const trade = V3Trade.createUncheckedTrade({
    route: route as RouteStableWrapper<TInput, TOutput>,
    inputAmount,
    outputAmount,
    tradeType,
  })

  if (route.pools.length === 1) {
    const vault = trade.swaps[0].route.pools[0].vault()
    const expectedamountIn = trade.maximumAmountIn(options.slippageTolerance).quotient.toString()
    const amountIn = useContractBalance ? CONTRACT_BALANCE : expectedamountIn
    const amountOut = trade.minimumAmountOut(options.slippageTolerance).quotient.toString()

    const params = [
      vault.address,
      tradeType == TradeType.EXACT_INPUT ? amountIn : amountOut,
      // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
      useContractBalance ? false : payerIsUser,
      tradeType == TradeType.EXACT_INPUT ? amountOut : expectedamountIn,
      routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
    ]

    if (tradeType == TradeType.EXACT_INPUT) {
      planner.addCommand(
        outputAmount.currency.wrapped.equals(vault) ? CommandType.ERC4626_DEPOSIT : CommandType.ERC4626_REDEEM,
        params
      )
    } else if (tradeType == TradeType.EXACT_OUTPUT) {
      planner.addCommand(
        outputAmount.currency.wrapped.equals(vault) ? CommandType.ERC4626_MINT : CommandType.ERC4626_WITHDRAW,
        params
      )
    }
  } else {
    throw new Error('UNEXPECTED_ROUTE - depositing a erc4626 vault into another erc4626 vault is not supported yet')
  }
}

export function addVaultMixedSwap(
  planner: RoutePlanner,
  { route, recipient, amountIn, amountOut, payerIsUser, useContractBalance }: MixedEncodingParams
) {
  if (route.pools.length === 1) {
    const vault = (route.pools[0] as Vault).vault()

    const params = [
      vault.address,
      useContractBalance ? CONTRACT_BALANCE : amountIn,
      // Next params are included for now. They can be ommited if executed in the middle of multi-hop swaps
      useContractBalance ? false : payerIsUser,
      amountOut,
      recipient,
    ]

    planner.addCommand(
      route.output.wrapped.equals(vault) ? CommandType.ERC4626_DEPOSIT : CommandType.ERC4626_REDEEM,
      params
    )
  } else {
    throw new Error('UNEXPECTED_ROUTE - depositing a erc4626 vault into another erc4626 vault is not supported yet')
  }
}
