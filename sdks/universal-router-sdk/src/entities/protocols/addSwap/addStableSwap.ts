import { BigNumberish } from '@ethersproject/bignumber'
import { RouteStable } from 'hermes-swap-router-sdk'
import { ComposableStablePool, Trade, TradeType } from 'hermes-v2-sdk'
import JSBI from 'jsbi'
import { Currency, NativeToken } from 'maia-core-sdk'

import { CONTRACT_BALANCE, MAX_LIMIT_BALANCER, ROUTER_AS_RECIPIENT } from '../../../utils/constants'
import { CommandType, RoutePlanner } from '../../../utils/routerCommands'
import { Swap } from '../uniswap'
import { EncodingParams, MixedEncodingParams } from './addMixedSwap'

export type BatchSwapStep = [string, BigNumberish, BigNumberish, BigNumberish, string[]]

export function addStableSwap<TInput extends Currency, TOutput extends Currency>(
  planner: RoutePlanner,
  { swap, options, tradeType, payerIsUser, routerMustCustody }: EncodingParams<TInput, TOutput>
): void {
  const { route, inputAmount, outputAmount }: Swap<TInput, TOutput> = swap

  const trade: Trade<ComposableStablePool, TInput, TOutput, TradeType> = Trade.createUncheckedTrade({
    route: route as RouteStable<TInput, TOutput>,
    inputAmount,
    outputAmount,
    tradeType,
  })

  if (route.pools.length === 1) {
    const amountIn = trade.maximumAmountIn(options.slippageTolerance).quotient.toString()
    const amountOut = trade.minimumAmountOut(options.slippageTolerance).quotient.toString()

    const stablePool = trade.swaps[0].route.pools[0]

    if (stablePool.wrappedTokenIndex === -1) {
      planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
        stablePool.pool.id,
        route.input.wrapped.address,
        route.output.wrapped.address,
        amountIn,
        amountOut,
        payerIsUser,
        routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
        [],
      ])
    } else {
      const wrappedToken = stablePool.wrappedTokenIndex === 0 ? stablePool.token0 : stablePool.token1
      const zeroForOutput = wrappedToken.equals(inputAmount.currency)
      const bptToken = stablePool.wrapper?.underlying()
      const hasBptToken =
        !!bptToken && bptToken.equals(stablePool.wrappedTokenIndex === 0 ? stablePool.token1 : stablePool.token0)

      if (zeroForOutput) {
        const params = [
          stablePool.wrapper?.vault().address,
          amountIn,
          // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
          payerIsUser,
          hasBptToken ? amountOut : 0,
          !hasBptToken || routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
        ]

        planner.addCommand(CommandType.ERC4626_REDEEM, params)
      }

      if (!hasBptToken) {
        planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
          stablePool.pool.id,
          zeroForOutput ? stablePool.pool.address : route.input.wrapped.address,
          zeroForOutput ? route.output.wrapped.address : stablePool.pool.address,
          zeroForOutput ? CONTRACT_BALANCE : amountIn,
          zeroForOutput ? amountOut : '0',
          zeroForOutput ? false : payerIsUser,
          zeroForOutput ? (routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient) : ROUTER_AS_RECIPIENT,
          [],
        ])
      }

      if (!zeroForOutput) {
        const params = [
          stablePool.wrapper?.vault().address,
          hasBptToken ? amountIn : CONTRACT_BALANCE,
          // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
          hasBptToken ? payerIsUser : false,
          amountOut,
          routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
        ]

        planner.addCommand(CommandType.ERC4626_DEPOSIT, params)
      }
    }
  } else {
    // TODO: Add support for stable pools with wrappers (check addStableMixedQuote)
    const steps: BatchSwapStep[] = []
    const amountIn = trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient.toString()
    const amountOut = trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient

    // Set the limits for the first and last tokens. Zero for all others
    const limits: BigNumberish[] = Array(route.path.length).fill(0)
    limits[route.path.findIndex((token) => token.equals(route.input.wrapped))] = amountIn
    limits[route.path.findIndex((token) => token.equals(route.output.wrapped))] = JSBI.multiply(
      amountOut,
      JSBI.BigInt(-1)
    ).toString()

    let outputToken: NativeToken
    let inputToken = route.input.wrapped
    for (let i = 0; i < route.pools.length; i++) {
      const pool: ComposableStablePool = trade.swaps[0].route.pools[i]

      /// Now, we get the output of this hop
      outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0

      const amount: string = i === 0 ? amountIn : '0'

      steps.push([
        pool.pool.id,
        route.path.findIndex((token) => token.equals(inputToken)),
        route.path.findIndex((token) => token.equals(outputToken)),
        amount,
        [],
      ])

      inputToken = outputToken
    }

    planner.addCommand(CommandType.BALANCER_BATCH_SWAPS_EXACT_IN, [
      steps,
      route.path.map((token) => token.address),
      limits,
      payerIsUser,
      routerMustCustody ? ROUTER_AS_RECIPIENT : options.recipient,
    ])
  }
}

export function addStableMixedSwap(
  planner: RoutePlanner,
  { route, recipient, amountIn, amountOut, payerIsUser }: MixedEncodingParams
) {
  if (route.pools.length === 1) {
    const stablePool = route.pools[0] as ComposableStablePool

    if (stablePool.wrappedTokenIndex === -1) {
      planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
        stablePool.pool.id,
        route.input.wrapped.address,
        route.output.wrapped.address,
        amountIn,
        amountOut,
        payerIsUser,
        recipient,
        [],
      ])
    } else {
      const wrappedToken = stablePool.wrappedTokenIndex === 0 ? stablePool.token0 : stablePool.token1
      const zeroForOutput = wrappedToken.equals(route.input.wrapped)
      const bptToken = stablePool.wrapper?.underlying()
      const hasBptToken =
        !!bptToken && bptToken.equals(stablePool.wrappedTokenIndex === 0 ? stablePool.token1 : stablePool.token0)

      if (zeroForOutput) {
        const params = [
          stablePool.wrapper?.vault().address,
          amountIn,
          // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
          payerIsUser,
          hasBptToken ? amountOut : 0,
          hasBptToken ? recipient : ROUTER_AS_RECIPIENT,
        ]

        planner.addCommand(CommandType.ERC4626_REDEEM, params)
      }

      if (!hasBptToken) {
        planner.addCommand(CommandType.BALANCER_SINGLE_SWAP_EXACT_IN, [
          stablePool.pool.id,
          zeroForOutput ? stablePool.pool.address : route.input.wrapped.address,
          zeroForOutput ? route.output.wrapped.address : stablePool.pool.address,
          zeroForOutput ? CONTRACT_BALANCE : amountIn,
          zeroForOutput ? amountOut : '0',
          zeroForOutput ? false : payerIsUser,
          zeroForOutput ? recipient : ROUTER_AS_RECIPIENT,
          [],
        ])
      }

      if (!zeroForOutput) {
        const params = [
          stablePool.wrapper?.vault().address,
          hasBptToken ? amountIn : CONTRACT_BALANCE,
          // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
          hasBptToken ? payerIsUser : false,
          amountOut,
          recipient,
        ]

        planner.addCommand(CommandType.ERC4626_DEPOSIT, params)
      }
    }
  } else {
    const path: NativeToken[] = [...route.path]

    const firstStablePool = route.pools[0] as ComposableStablePool
    // Check if the first pool has a wrapped token
    if (firstStablePool.wrappedTokenIndex !== -1 && firstStablePool.wrapper) {
      const params = [
        firstStablePool.wrapper.vault().address,
        amountIn,
        // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
        payerIsUser,
        0,
        ROUTER_AS_RECIPIENT,
      ]

      planner.addCommand(CommandType.ERC4626_REDEEM, params)

      // Update the inputToken in the path to be the first pool's BPT
      path[0] = firstStablePool.wrapper.underlying()
    }

    const steps: BatchSwapStep[] = route.pools.map((pool, i) => [
      (pool as ComposableStablePool).pool.id,
      i,
      i + 1,
      i === 0 ? (firstStablePool.wrappedTokenIndex !== -1 ? CONTRACT_BALANCE : amountIn) : '0',
      [],
    ])

    const lastStablePool = route.pools[route.pools.length - 1] as ComposableStablePool

    // Set the limits for the first and last tokens. Zero for all others
    const limits: BigNumberish[] = Array(route.path.length).fill(0)
    limits[0] = amountIn === CONTRACT_BALANCE ? MAX_LIMIT_BALANCER : amountIn
    limits[limits.length - 1] =
      Number(amountOut) > 0 && lastStablePool.wrappedTokenIndex === -1
        ? JSBI.multiply(JSBI.BigInt(amountOut), JSBI.BigInt(-1)).toString()
        : 0

    // Check if it's the last pool and it has a wrapped token
    if (lastStablePool.wrappedTokenIndex !== -1 && lastStablePool.wrapper) {
      // Update the outputToken in the path to be the last pool's BPT
      path[limits.length - 1] = lastStablePool.wrapper.underlying()
    }

    planner.addCommand(CommandType.BALANCER_BATCH_SWAPS_EXACT_IN, [
      steps,
      path.map((token) => token.address),
      limits,
      firstStablePool.wrappedTokenIndex !== -1 ? false : payerIsUser,
      lastStablePool.wrappedTokenIndex !== -1 ? ROUTER_AS_RECIPIENT : recipient,
    ])

    // Check if the last pool has a wrapped token
    if (lastStablePool.wrappedTokenIndex !== -1) {
      const params = [
        lastStablePool.wrapper?.vault().address,
        CONTRACT_BALANCE,
        // Next params are included for now. They can be ommited if the appropriate checks are done before/after the swap
        false,
        amountOut,
        recipient,
      ]

      planner.addCommand(CommandType.ERC4626_DEPOSIT, params)
    }
  }
}
