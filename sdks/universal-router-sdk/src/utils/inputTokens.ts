import { arrayify, joinSignature, splitSignature } from '@ethersproject/bytes'
import invariant from 'tiny-invariant'

import { InputTokenOptions, Permit2Permit } from '../types'
import { BALANCER_VAULT_ID, OPENSEA_CONDUIT_SPENDER_ID, ROUTER_AS_RECIPIENT, SUDOSWAP_SPENDER_ID } from './constants'
import { CommandType, RoutePlanner } from './routerCommands'

const SIGNATURE_LENGTH = 65
const EIP_2098_SIGNATURE_LENGTH = 64

export function encodePermit(planner: RoutePlanner, permit2: Permit2Permit): void {
  let signature = permit2.signature

  const length = arrayify(permit2.signature).length
  // signature data provided for EIP-1271 may have length different from ECDSA signature
  if (length === SIGNATURE_LENGTH || length === EIP_2098_SIGNATURE_LENGTH) {
    // sanitizes signature to cover edge cases of malformed EIP-2098 sigs and v used as recovery id
    signature = joinSignature(splitSignature(permit2.signature))
  }

  planner.addCommand(CommandType.PERMIT2_PERMIT, [permit2, signature])
}

// Handles the encoding of commands needed to gather input tokens for a trade
// Approval: The router approving another address to take tokens.
//   note: Balancer, seaport and sudoswap support this action with less calldata. Approvals are left open.
//   note: Any approvals can also be done with a spender address. Approvals are left open.
// Permit: A Permit2 signature-based Permit to allow the router to access a user's tokens
// Transfer: A Permit2 TransferFrom of tokens from a user to either the router or another address
export function encodeInputTokenOptions(planner: RoutePlanner, options: InputTokenOptions) {
  // first ensure that all tokens provided for encoding are the same
  if (!!options.approval && !!options.permit2Permit)
    invariant(options.approval.token === options.permit2Permit.details.token, `inconsistent token`)
  if (!!options.approval && !!options.permit2TransferFrom)
    invariant(options.approval.token === options.permit2TransferFrom.token, `inconsistent token`)
  if (!!options.permit2TransferFrom && !!options.permit2Permit)
    invariant(options.permit2TransferFrom.token === options.permit2Permit.details.token, `inconsistent token`)

  // if an options.approval is required, add it
  if (!!options.approval) {
    const protocol: number | undefined = mapApprovalProtocol(options.approval.protocol)
    if (protocol !== undefined) planner.addCommand(CommandType.APPROVE_ERC20, [options.approval.token, protocol])
    else planner.addCommand(CommandType.APPROVE_ERC20_ADDRESS, [options.approval.token, options.approval.protocol])
  }

  // if this order has a options.permit2Permit, encode it
  if (!!options.permit2Permit) {
    encodePermit(planner, options.permit2Permit)
  }

  if (!!options.permit2TransferFrom) {
    planner.addCommand(CommandType.PERMIT2_TRANSFER_FROM, [
      options.permit2TransferFrom.token,
      options.permit2TransferFrom.recipient ? options.permit2TransferFrom.recipient : ROUTER_AS_RECIPIENT,
      options.permit2TransferFrom.amount,
    ])
  }
}

function mapApprovalProtocol(protocolAddress: string): number | undefined {
  switch (protocolAddress.toLowerCase()) {
    case '0x00000000000000adc04c56bf30ac9d3c0aaf14dc': // Seaport v1.5
      return OPENSEA_CONDUIT_SPENDER_ID
    case '0x00000000000001ad428e4906ae43d8f9852d0dd6': // Seaport v1.4
      return OPENSEA_CONDUIT_SPENDER_ID
    case '0x2b2e8cda09bba9660dca5cb6233787738ad68329': // Sudoswap
      return SUDOSWAP_SPENDER_ID
    case '0xba12222222228d8ba445958a75a0704d566bf2c8': // Balancer Vault
      return BALANCER_VAULT_ID
    default:
      return undefined
  }
}
