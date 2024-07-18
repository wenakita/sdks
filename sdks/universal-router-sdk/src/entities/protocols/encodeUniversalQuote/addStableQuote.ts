import { ComposableStablePool } from 'hermes-v2-sdk'
import { Currency, NativeToken } from 'maia-core-sdk'

import { QuotePlanner } from '../../../utils/quoterCommands'
import { CommandType } from '../../../utils/routerCommands'
import { BatchSwapStep } from '../addSwap/addStableSwap'
import { MixedEncodingParams, SingleEncodingParams } from '.'

export function addStableQuote<TInput extends Currency, TOutput extends Currency>(
  planner: QuotePlanner,
  { route, amount }: SingleEncodingParams<TInput, TOutput>
): void {
  if (route.pools.length === 1) {
    const stablePool = route.pools[0] as ComposableStablePool

    if (stablePool.wrappedTokenIndex === -1) {
      planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
        stablePool.pool.id,
        route.input.wrapped.address,
        route.output.wrapped.address,
        amount.quotient.toString(),
        [],
      ])
    } else {
      const wrappedToken = stablePool.wrappedTokenIndex === 0 ? stablePool.token0 : stablePool.token1
      const zeroForOutput = wrappedToken.equals(amount.currency)

      if (zeroForOutput) {
        planner.addCommand(CommandType.ERC4626_REDEEM, [wrappedToken.address, amount.quotient.toString()])
      }

      planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
        stablePool.pool.id,
        zeroForOutput ? stablePool.pool.address : route.input.wrapped.address,
        zeroForOutput ? route.output.wrapped.address : stablePool.pool.address,
        zeroForOutput ? '0' : amount.quotient.toString(),
        [],
      ])

      if (!zeroForOutput) {
        planner.addCommand(CommandType.ERC4626_DEPOSIT, [wrappedToken.address, '0'])
      }
    }
  } else {
    // TODO: Add support for stable pools with wrappers (check addStableMixedQuote below)
    const steps: BatchSwapStep[] = []

    let outputToken: NativeToken
    let inputToken = route.input.wrapped
    for (let i = 0; i < route.pools.length; i++) {
      const pool: ComposableStablePool = route.pools[i] as ComposableStablePool

      /// Now, we get the output of this hop
      outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0

      const nextAmount: string = i === 0 ? amount.quotient.toString() : '0'

      steps.push([
        pool.pool.id,
        route.path.findIndex((token) => token.equals(inputToken)),
        route.path.findIndex((token) => token.equals(outputToken)),
        nextAmount,
        [],
      ])

      inputToken = outputToken
    }

    planner.addCommand(CommandType.BALANCER_BATCH_SWAPS_EXACT_IN, [steps, route.path.map((token) => token.address)])
  }
}

export function addStableMixedQuote(planner: QuotePlanner, { route, amountIn }: MixedEncodingParams) {
  if (route.pools.length === 1) {
    const stablePool = route.pools[0] as ComposableStablePool

    if (stablePool.wrappedTokenIndex === -1) {
      planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
        (route.pools[0] as ComposableStablePool).pool.id,
        route.input.wrapped.address,
        route.output.wrapped.address,
        amountIn,
        [],
      ])
    } else {
      const wrappedToken = stablePool.wrappedTokenIndex === 0 ? stablePool.token0 : stablePool.token1
      const zeroForOutput = wrappedToken.equals(route.input.wrapped)

      if (zeroForOutput) {
        planner.addCommand(CommandType.ERC4626_REDEEM, [wrappedToken.address, amountIn])
      }

      planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
        stablePool.pool.id,
        zeroForOutput ? stablePool.pool.address : route.input.wrapped.address,
        zeroForOutput ? route.output.wrapped.address : stablePool.pool.address,
        zeroForOutput ? '0' : amountIn,
        [],
      ])

      if (!zeroForOutput) {
        planner.addCommand(CommandType.ERC4626_DEPOSIT, [wrappedToken.address, '0'])
      }
    }
  } else {
    const path: NativeToken[] = [...route.path]

    const firstStablePool = route.pools[0] as ComposableStablePool
    // Check if the first pool has a wrapped token
    if (firstStablePool.wrappedTokenIndex !== -1 && firstStablePool.wrapper) {
      planner.addCommand(CommandType.ERC4626_REDEEM, [firstStablePool.wrapper.vault().address, amountIn])

      // Update the inputToken in the path to be the first pool's BPT
      path[0] = firstStablePool.wrapper.underlying()
    }

    const steps: BatchSwapStep[] = route.pools.map((pool, i) => [
      (pool as ComposableStablePool).pool.id,
      i,
      i + 1,
      i === 0 ? (firstStablePool.wrappedTokenIndex !== -1 ? amountIn : '0') : '0',
      [],
    ])

    const lastStablePool = route.pools[route.pools.length - 1] as ComposableStablePool
    // Check if the last pool has a wrapped token
    if (lastStablePool.wrappedTokenIndex !== -1 && lastStablePool.wrapper) {
      // Update the outputToken in the path to be the last pool's BPT
      path[path.length - 1] = lastStablePool.wrapper.underlying()
    }

    planner.addCommand(CommandType.BALANCER_BATCH_SWAPS_EXACT_IN, [steps, path.map((token) => token.address)])

    // Check if the last pool has a wrapped token
    if (lastStablePool.wrappedTokenIndex !== -1) {
      planner.addCommand(CommandType.ERC4626_DEPOSIT, [lastStablePool.wrapper?.vault().address, '0'])
    }
  }
}
