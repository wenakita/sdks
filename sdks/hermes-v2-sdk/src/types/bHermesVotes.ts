/**
 * Contains the parameters for the delegate action in bHermesVotes
 * @param newDelegatee the address to delegate to
 */
export type TDelegateVotesParams = {
  newDelegatee: string
}

/**
 * Contains the parameters for the undelegate action in bHermesVotes
 * @param delegatee the address to undelegate from
 * @param amount the amount to undelegate
 */
export type TUndelegateVotesParams = {
  delegatee: string
  amount: string
}
