/**
 * Contains the parameters for the burn action in bHermes.
 * @param amount total amount of hermes that the user wants to burn.
 * @param receiver receiver address of the burnt hermes.
 */
export type TBurnHermesParams = {
  amount: string
  receiver: string
}

/**
 * Contains the parameters for the forfeitMultiple and claimMultiple actions in bHermes.
 * @param amount amount of each type of reward to forfeit or claim.
 */
export type TForfeitClaimParams = {
  amount: string
}

/**
 * Contains the parameters for the forfeitMultipleAmounts and claimMultipleAmounts actions in bHermes.
 * @param weights amount of weight to forfeit or claim.
 * @param boost amount of boost to forfeit or claim.
 * @param governance amount of governance to forfeit or claim.
 */
export type TForfeitClaimMultipleParams = {
  weight: string
  boost: string
  governance: string
}
