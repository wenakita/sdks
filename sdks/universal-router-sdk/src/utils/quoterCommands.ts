import { defaultAbiCoder } from 'ethers/lib/utils'

import { SwapRouter } from '../swapRouter'
import { CommandType, RouterCommand } from './routerCommands'

const QUOTE_NOT_SUPPORTED = ['']

const ABI_DEFINITION: { [key in CommandType]: string[] } = {
  // Batch Reverts
  [CommandType.EXECUTE_SUB_PLAN]: QUOTE_NOT_SUPPORTED,

  // Permit2 Actions
  [CommandType.PERMIT2_PERMIT]: QUOTE_NOT_SUPPORTED,
  [CommandType.PERMIT2_PERMIT_BATCH]: QUOTE_NOT_SUPPORTED,
  [CommandType.PERMIT2_TRANSFER_FROM]: QUOTE_NOT_SUPPORTED,
  [CommandType.PERMIT2_TRANSFER_FROM_BATCH]: QUOTE_NOT_SUPPORTED,

  // Uniswap Actions
  [CommandType.V3_SWAP_EXACT_IN]: ['uint256', 'bytes'],
  [CommandType.V3_SWAP_EXACT_OUT]: ['uint256', 'bytes'],
  [CommandType.V2_SWAP_EXACT_IN]: QUOTE_NOT_SUPPORTED,
  [CommandType.V2_SWAP_EXACT_OUT]: QUOTE_NOT_SUPPORTED,

  // Token Actions and Checks
  [CommandType.WRAP_ETH]: QUOTE_NOT_SUPPORTED,
  [CommandType.UNWRAP_WETH]: QUOTE_NOT_SUPPORTED,
  [CommandType.SWEEP]: QUOTE_NOT_SUPPORTED,
  [CommandType.SWEEP_ERC721]: QUOTE_NOT_SUPPORTED,
  [CommandType.SWEEP_ERC1155]: QUOTE_NOT_SUPPORTED,
  [CommandType.TRANSFER]: QUOTE_NOT_SUPPORTED,
  [CommandType.PAY_PORTION]: QUOTE_NOT_SUPPORTED,
  [CommandType.BALANCE_CHECK_ERC20]: QUOTE_NOT_SUPPORTED,
  [CommandType.OWNER_CHECK_721]: QUOTE_NOT_SUPPORTED,
  [CommandType.OWNER_CHECK_1155]: QUOTE_NOT_SUPPORTED,
  [CommandType.APPROVE_ERC20]: QUOTE_NOT_SUPPORTED,
  [CommandType.APPROVE_ERC20_ADDRESS]: QUOTE_NOT_SUPPORTED,

  // NFT Markets
  [CommandType.SEAPORT_V1_5]: QUOTE_NOT_SUPPORTED,
  [CommandType.SEAPORT_V1_4]: QUOTE_NOT_SUPPORTED,
  [CommandType.NFTX]: QUOTE_NOT_SUPPORTED,
  [CommandType.LOOKS_RARE_V2]: QUOTE_NOT_SUPPORTED,
  [CommandType.X2Y2_721]: QUOTE_NOT_SUPPORTED,
  [CommandType.X2Y2_1155]: QUOTE_NOT_SUPPORTED,
  [CommandType.FOUNDATION]: QUOTE_NOT_SUPPORTED,
  [CommandType.SUDOSWAP]: QUOTE_NOT_SUPPORTED,
  [CommandType.NFT20]: QUOTE_NOT_SUPPORTED,
  [CommandType.CRYPTOPUNKS]: QUOTE_NOT_SUPPORTED,
  [CommandType.ELEMENT_MARKET]: QUOTE_NOT_SUPPORTED,

  // ERC4626 Actions
  [CommandType.ERC4626_DEPOSIT]: ['address', 'uint256'],
  [CommandType.ERC4626_REDEEM]: ['address', 'uint256'],
  [CommandType.ERC4626_MINT]: ['address', 'uint256'],
  [CommandType.ERC4626_WITHDRAW]: ['address', 'uint256'],

  // Balancer Batch Swap Actions
  [CommandType.BALANCER_BATCH_SWAPS_EXACT_IN]: ['tuple(bytes32,uint256,uint256,uint256,bytes)[]', 'address[]'],
  [CommandType.BALANCER_SINGLE_SWAP_EXACT_IN]: ['bytes32', 'address', 'address', 'uint256', 'bytes'],
  [CommandType.BALANCER_BATCH_SWAPS_EXACT_OUT]: QUOTE_NOT_SUPPORTED,
  [CommandType.BALANCER_SINGLE_SWAP_EXACT_OUT]: QUOTE_NOT_SUPPORTED,
}

export class QuotePlanner {
  commands: string
  inputs: string[]

  constructor() {
    this.commands = '0x'
    this.inputs = []
  }

  addCommand(type: CommandType, parameters: any[]): void {
    const command = createCommand(type, parameters)
    this.inputs.push(command.encodedInput)

    this.commands = this.commands.concat(command.type.toString(16).padStart(2, '0'))
  }

  /**
   * Encodes a planned route into a method name and parameters for the quoter contract.
   */
  encodePlan(): string {
    const functionSignature = 'execute(bytes,bytes[])'
    const parameters = [this.commands, this.inputs]
    const calldata = SwapRouter.INTERFACE.encodeFunctionData(functionSignature, parameters)
    return calldata
  }
}

function createCommand(type: CommandType, parameters: any[]): RouterCommand {
  const encodedInput = defaultAbiCoder.encode(ABI_DEFINITION[type], parameters)
  return { type, encodedInput }
}
