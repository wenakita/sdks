/**
 * @title Virtual Account Types
 * @notice Types for Virtual Account
 * @author MaiaDAO
 */

/**
 * IWithdrawNativeParams
 * @notice Interface for withdraw native params from Virtual Account.
 * @param amount Amount of native tokens to withdraw
 */
export interface IWithdrawNativeParams {
  amount: string
}

/**
 * IWithdrawERC20Params
 * @notice Interface for withdraw ERC20 params from Virtual Account.
 * @param token Token address to withdraw
 * @param amount Amount of token to withdraw
 */
export interface IWithdrawERC20Params {
  token: string
  amount: string
}

/**
 * IWithdrawERC721Params
 * @notice Interface for withdraw ERC721 params from Virtual Account.
 * @param token Token address to withdraw
 * @param tokenId Token ID to withdraw
 */
export interface IWithdrawERC721Params {
  token: string
  tokenId: string
}
