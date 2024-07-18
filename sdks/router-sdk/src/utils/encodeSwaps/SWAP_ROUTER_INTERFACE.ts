import { Interface } from '@ethersproject/abi'
import ISwapRouter02ABI from '@uniswap/swap-router-contracts/artifacts/contracts/interfaces/ISwapRouter02.sol/ISwapRouter02.json'

export const SWAP_ROUTER_INTERFACE: Interface = new Interface(ISwapRouter02ABI.abi)
