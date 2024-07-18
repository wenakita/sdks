import { Interface } from '@ethersproject/abi'
import JSBI from 'jsbi'
import { ZERO, ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import bHermes from '../../abis/BurntHermes.json'
import { TBurnHermesParams, TForfeitClaimMultipleParams, TForfeitClaimParams } from '../../types/bHermes'

/**
 * @title BHermes class
 * @notice Provides a set of function to encode calldata for the different bHermes contract interactions.
 * @author MaiaDAO
 */
export abstract class BHermes {
  public static readonly INTERFACE: Interface = new Interface(bHermes)

  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}

  /**
   * Encodes the contract interaction calldata to burn $Hermes in exchange for $bHermes.
   * @param amount amount of hermes that the user wants to burn.
   * @param receiver receiver address of the burnt hermes.
   * @returns the encoded calldata for the burn action.
   */
  public static encodeBurnCalldata({ amount, receiver }: TBurnHermesParams): string {
    // Check if the burn amount and receiver address is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Hermes amount can't be negative")
    invariant(receiver, 'Invalid receiver address')
    invariant(receiver !== ZERO_ADDRESS, 'Invalid receiver address')
    // Encode the burn action.
    return BHermes.INTERFACE.encodeFunctionData('deposit', [amount.toString(), receiver])
  }

  /**
   * Encodes the contract interaction calldata to claim outstanding rewards.
   * @returns the encoded calldata for the claimOutstanding action.
   */
  public static encodeClaimOutstandingCalldata(): string {
    // Encode the claimOutstanding action.
    return BHermes.INTERFACE.encodeFunctionData('claimOutstanding')
  }

  /**
   * Encodes the contract interaction calldata to forfeit outstanding rewards.
   * @returns the encoded calldata for the forfeitOutstanding action.
   */
  public static encodeForfeitOutstandingCalldata(): string {
    // Encode the forfeitOutstanding action.
    return BHermes.INTERFACE.encodeFunctionData('forfeitOutstanding')
  }

  /**
   * Encodes the contract interaction calldata to forfeit a certain amount of all types of rewards.
   * @param amount amount of each utility token to forfeit.
   * @returns the encoded calldata for the forfeitMultiple action.
   */
  public static encodeForfeitMultipleCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the forfeit amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Forfeit amount can't be negative")
    // Encode the forfeitMultiple action.
    return BHermes.INTERFACE.encodeFunctionData('forfeitMultiple', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to claim a certain amount of all types of rewards.
   * @param weight amount of weight to claim.
   * @param boost amount of boost to claim.
   * @param governance amount of governance to claim.
   * @returns the encoded calldata for the claimMultiple action.
   */
  public static encodeForfeitMultipleAmoutnsCalldata({
    weight,
    boost,
    governance,
  }: TForfeitClaimMultipleParams): string {
    // Check if the forfeit amount is valid.
    invariant(JSBI.BigInt(weight) >= ZERO, "Forfeit amount can't be negative")
    invariant(JSBI.BigInt(boost) >= ZERO, "Forfeit amount can't be negative")
    invariant(JSBI.BigInt(governance) >= ZERO, "Forfeit amount can't be negative")
    // Encode the forfeitMultiple action.
    return BHermes.INTERFACE.encodeFunctionData('forfeitMultipleAmounts', [
      weight.toString(),
      boost.toString(),
      governance.toString(),
    ])
  }

  /**
   * Encodes the contract interaction calldata to forfeit weight.
   * @param amount amount of weight to forfeit.
   * @returns the encoded calldata for the forfeitWeight action.
   */
  public static encodeForfeitWeightCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the forfeit amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Forfeit amount can't be negative")
    // Encode the forfeitWeight action.
    return BHermes.INTERFACE.encodeFunctionData('forfeitWeight', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to forfeit boost.
   * @param amount amount of boost to forfeit.
   * @returns the encoded calldata for the forfeitBoost action.
   */
  public static encodeForfeitBoostCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the forfeit amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Forfeit amount can't be negative")
    // Encode the forfeitBoost action.
    return BHermes.INTERFACE.encodeFunctionData('forfeitBoost', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to forfeit governance.
   * @param amount amount of governance to forfeit.
   * @returns the encoded calldata for the forfeitGovernance action.
   */
  public static encodeForfeitGovernanceCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the forfeit amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Forfeit amount can't be negative")
    // Encode the forfeitGovernance action.
    return BHermes.INTERFACE.encodeFunctionData('forfeitGovernance', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to claim multiple.
   * @param amount amount of each utility token to claim.
   * @returns the encoded calldata for the claimMultiple action.
   */
  public static encodeClaimMultipleCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the claim amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Claim amount can't be negative")
    // Encode the claimMultiple action.
    return BHermes.INTERFACE.encodeFunctionData('claimMultiple', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to claim multiple amounts.
   * @param weight amount of weight to claim.
   * @param boost amount of boost to claim.
   * @param governance amount of governance to claim.
   * @returns the encoded calldata for the claimMultipleAmounts action.
   */
  public static encodeClaimMultipleAmountsCalldata({ weight, boost, governance }: TForfeitClaimMultipleParams): string {
    // Check if the claim amount is valid.
    invariant(JSBI.BigInt(weight) >= ZERO, "Claim amount can't be negative")
    invariant(JSBI.BigInt(boost) >= ZERO, "Claim amount can't be negative")
    invariant(JSBI.BigInt(governance) >= ZERO, "Claim amount can't be negative")
    // Encode the claimMultipleAmounts action.
    return BHermes.INTERFACE.encodeFunctionData('claimMultipleAmounts', [
      weight.toString(),
      boost.toString(),
      governance.toString(),
    ])
  }

  /**
   * Encodes the contract interaction calldata to claim weight.
   * @param amount amount of weight to claim.
   * @returns the encoded calldata for the claimWeight action.
   */
  public static encodeClaimWeightCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the claim amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Claim amount can't be negative")
    // Encode the claimWeight action.
    return BHermes.INTERFACE.encodeFunctionData('claimWeight', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to claim boost.
   * @param amount amount of boost to claim.
   * @returns the encoded calldata for the claimBoost action.
   */
  public static encodeClaimBoostCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the claim amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Claim amount can't be negative")
    // Encode the claimBoost action.
    return BHermes.INTERFACE.encodeFunctionData('claimBoost', [amount.toString()])
  }

  /**
   * Encodes the contract interaction calldata to claim governance.
   * @param amount amount of governance to claim.
   * @returns the encoded calldata for the claimGovernance action.
   */
  public static encodeClaimGovernanceCalldata({ amount }: TForfeitClaimParams): string {
    // Check if the claim amount is valid.
    invariant(JSBI.BigInt(amount) >= ZERO, "Claim amount can't be negative")
    // Encode the claimGovernance action.
    return BHermes.INTERFACE.encodeFunctionData('claimGovernance', [amount.toString()])
  }
}
