import { Interface } from '@ethersproject/abi'
import INonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import JSBI from 'jsbi'
import { CurrencyAmount, MethodParameters, NativeToken, ONE, toHex, ZERO } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { ADDRESS_ZERO } from '../../constants/constants'
import {
  AddLiquidityOptions,
  CollectOptions,
  MintOptions,
  RemoveLiquidityOptions,
  SafeTransferOptions,
} from '../../types/nonfungiblePositionManager'
import { validateAndParseAddress } from '../../utils/addresses/validateAndParseAddress'
import { Multicall } from '../multicall'
import { Payments } from '../payment'
import { Pool } from '../pool'
import { Position } from '../position'
import { SelfPermit } from '../self-permit'

const MaxUint128 = toHex(JSBI.subtract(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)), JSBI.BigInt(1)))

// type guard
function isMint(options: AddLiquidityOptions): options is MintOptions {
  return Object.keys(options).some((k) => k === 'recipient')
}

export abstract class NonfungiblePositionManager {
  public static readonly INTERFACE: Interface = new Interface(INonfungiblePositionManager.abi)

  /**
   * Encodes the parameters for the creation of a new uni v3 pool.
   * @param pool pool to create
   * @returns the calldata for the tx
   * // TODO improve function naming
   */
  private static encodeCreate(pool: Pool): string {
    return NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndInitializePoolIfNecessary', [
      pool.token0.address,
      pool.token1.address,
      pool.fee,
      toHex(pool.sqrtRatioX96),
    ])
  }

  /**
   * Creates the necessary params to execute the creation of a new uni v3 pool
   * @param pool pool details to create
   * @returns calldata & value for the tx execution
   * // TODO improve function naming
   */
  public static createCallParameters(pool: Pool): MethodParameters {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0),
    }
  }

  /**
   * Creates the native add liquidity call parameters for adding liquidity to a uni v3 position
   * @param position holds the position details we want to create/add to
   * @param options holds the options for the add liquidity call
   * // TODO improve function naming
   * @returns
   */
  public static addCallParameters(position: Position, options: AddLiquidityOptions): MethodParameters {
    if (position.pool instanceof Pool) {
      invariant(JSBI.greaterThan(position.liquidity, ZERO), 'ZERO_LIQUIDITY')

      const calldatas: string[] = []

      // get amounts
      const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts as {
        amount0: JSBI
        amount1: JSBI
      }

      // adjust for slippage
      const minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance) as {
        amount0: JSBI
        amount1: JSBI
      }
      const amount0Min = toHex(minimumAmounts.amount0)
      const amount1Min = toHex(minimumAmounts.amount1)

      const deadline = toHex(options.deadline)

      // create pool if needed
      if (isMint(options) && options.createPool) {
        calldatas.push(this.encodeCreate(position.pool))
      }

      // permits if necessary
      if (options.token0Permit) {
        calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit))
      }
      if (options.token1Permit) {
        calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit))
      }

      // mint
      if (isMint(options)) {
        const recipient: string = validateAndParseAddress(options.recipient)

        calldatas.push(
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [
            {
              token0: position.pool.token0.address,
              token1: position.pool.token1.address,
              fee: position.pool.fee,
              tickLower: position.tickLower,
              tickUpper: position.tickUpper,
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              recipient,
              deadline,
            },
          ])
        )
      } else {
        // increase
        calldatas.push(
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('increaseLiquidity', [
            {
              tokenId: toHex(options.tokenId),
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              deadline,
            },
          ])
        )
      }

      let value: string = toHex(0)

      if (options.useNative) {
        const wrapped = options.useNative.wrapped
        invariant(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped), 'NO_WETH')

        const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired

        // we only need to refund if we're actually sending ETH
        if (JSBI.greaterThan(wrappedValue, ZERO)) {
          calldatas.push(Payments.encodeRefundETH())
        }

        value = toHex(wrappedValue)
      }

      // Tranfer the NFT at the end if requested and the position is not being minted
      if (!isMint(options) && options.afterActionTransfer) {
        calldatas.push(
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
            options.afterActionTransfer.owner,
            options.afterActionTransfer.recipient ?? options.afterActionTransfer.owner,
            toHex(options.tokenId),
          ])
        )
      }

      return {
        calldata: Multicall.encodeMulticall(calldatas),
        value,
      }
    } else {
      return { calldata: '', value: '' }
    }
  }

  /**
   *  Creates the native collect calldata for collection fees from a uni v3 position
   * @param options holds the options for the collect call
   * @returns
   */
  private static encodeCollect(options: CollectOptions): string[] {
    const calldatas: string[] = []

    const tokenId = toHex(options.tokenId)

    const involvesETH =
      options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative

    const recipient = validateAndParseAddress(options.recipient)

    if (options.permit) {
      calldatas.push(
        NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [
          validateAndParseAddress(options.permit.spender),
          tokenId,
          toHex(options.permit.deadline),
          options.permit.v,
          options.permit.r,
          options.permit.s,
        ])
      )
    }

    // collect
    calldatas.push(
      NonfungiblePositionManager.INTERFACE.encodeFunctionData('collect', [
        {
          tokenId,
          recipient: involvesETH ? ADDRESS_ZERO : recipient,
          amount0Max: MaxUint128,
          amount1Max: MaxUint128,
        },
      ])
    )

    if (involvesETH) {
      const ethAmount = options.expectedCurrencyOwed0.currency.isNative
        ? options.expectedCurrencyOwed0.quotient
        : options.expectedCurrencyOwed1.quotient
      const token = options.expectedCurrencyOwed0.currency.isNative
        ? (options.expectedCurrencyOwed1.currency as NativeToken)
        : (options.expectedCurrencyOwed0.currency as NativeToken)
      const tokenAmount = options.expectedCurrencyOwed0.currency.isNative
        ? options.expectedCurrencyOwed1.quotient
        : options.expectedCurrencyOwed0.quotient

      calldatas.push(Payments.encodeUnwrapWETH9(ethAmount, recipient))
      calldatas.push(Payments.encodeSweepToken(token, tokenAmount, recipient))
    }

    // Tranfer the NFT at the end if requested
    if (options.afterActionTransfer) {
      calldatas.push(
        NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
          options.afterActionTransfer.owner,
          options.afterActionTransfer.recipient ?? options.afterActionTransfer.owner,
          toHex(options.tokenId),
        ])
      )
    }

    return calldatas
  }

  /**
   * Produces the on chain calldata to perform a collect operation
   * @param options holds the options for the collect liquidity call
   * @returns
   * // TODO improve function naming
   */
  public static collectCallParameters(options: CollectOptions): MethodParameters {
    const calldatas: string[] = NonfungiblePositionManager.encodeCollect(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  /**
   * Produces the native uni v3 calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   * // TODO improve function naming
   */
  public static removeCallParameters(position: Position, options: RemoveLiquidityOptions): MethodParameters {
    const calldatas: string[] = []

    const deadline = toHex(options.deadline)
    const tokenId = toHex(options.tokenId)

    // construct a partial position with a percentage of liquidity
    const partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
    })
    invariant(JSBI.greaterThan(partialPosition.liquidity, ZERO), 'ZERO_LIQUIDITY')

    // slippage-adjusted underlying amounts
    const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
      options.slippageTolerance
    ) as {
      amount0: JSBI
      amount1: JSBI
    }

    if (options.permit) {
      calldatas.push(
        NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [
          validateAndParseAddress(options.permit.spender),
          tokenId,
          toHex(options.permit.deadline),
          options.permit.v,
          options.permit.r,
          options.permit.s,
        ])
      )
    }

    // remove liquidity
    calldatas.push(
      NonfungiblePositionManager.INTERFACE.encodeFunctionData('decreaseLiquidity', [
        {
          tokenId,
          liquidity: toHex(partialPosition.liquidity),
          amount0Min: toHex(amount0Min),
          amount1Min: toHex(amount1Min),
          deadline,
        },
      ])
    )

    const { expectedCurrencyOwed0, expectedCurrencyOwed1, ...rest } = options.collectOptions
    calldatas.push(
      ...NonfungiblePositionManager.encodeCollect({
        tokenId: toHex(options.tokenId),
        // add the underlying value to the expected currency already owed
        expectedCurrencyOwed0: expectedCurrencyOwed0.add(
          CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)
        ),
        expectedCurrencyOwed1: expectedCurrencyOwed1.add(
          CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min)
        ),
        ...rest,
      })
    )

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [tokenId]))
      }
    } else {
      invariant(options.burnToken !== true, 'CANNOT_BURN')

      // Tranfer the NFT at the end if requested
      if (options.afterActionTransfer) {
        calldatas.push(
          NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
            options.afterActionTransfer.owner,
            options.afterActionTransfer.recipient ?? options.afterActionTransfer.owner,
            toHex(options.tokenId),
          ])
        )
      }
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  private static encodeSafeTransferFrom(options: SafeTransferOptions) {
    const recipient = validateAndParseAddress(options.recipient)
    const sender = validateAndParseAddress(options.sender)

    let permitCalldata: string | undefined
    if (options.permit) {
      permitCalldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [
        validateAndParseAddress(options.permit.spender),
        options.tokenId,
        toHex(options.permit.deadline),
        options.permit.v,
        options.permit.r,
        options.permit.s,
      ])
    }

    let calldata: string
    if (options.data) {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData(
        'safeTransferFrom(address,address,uint256,bytes)',
        [sender, recipient, toHex(options.tokenId), options.data]
      )
    } else {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        sender,
        recipient,
        toHex(options.tokenId),
      ])
    }
    return { permitCalldata, calldata }
  }

  public static safeTransferFromParameters(options: SafeTransferOptions): MethodParameters {
    const { permitCalldata, calldata }: { permitCalldata: string | undefined; calldata: string } =
      NonfungiblePositionManager.encodeSafeTransferFrom(options)

    return {
      calldata: options.permit && permitCalldata ? Multicall.encodeMulticall([permitCalldata, calldata]) : calldata,
      value: toHex(0),
    }
  }

  public static safeTransferFromMultipleParameters(options: SafeTransferOptions[]): MethodParameters {
    invariant(options.length > 0, 'NO_OPTIONS_PROVIDED')

    if (options.length === 1) return NonfungiblePositionManager.safeTransferFromParameters(options[0])

    const calldatas: string[] = []

    for (const option of options) {
      const { permitCalldata, calldata }: { permitCalldata: string | undefined; calldata: string } =
        NonfungiblePositionManager.encodeSafeTransferFrom(option)

      if (option.permit && permitCalldata) calldatas.push(permitCalldata)
      calldatas.push(calldata)
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }
}
