import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { SupportedChainId, Ulysses, ZERO_ADDRESS } from 'maia-core-sdk'
import invariant from 'tiny-invariant'

import { bytecode, testnetBytecode } from '../abis/VirtualAccount.json'
import { ROOT_CHAIN_IDS } from '../constants'

/**
 * Given an account address, this function will calculate the virtual account address of the given user.
 * @param account - The account address of the user.
 * @returns
 */
export function computeVirtualAccount(account: string, chainId: SupportedChainId): string {
  invariant(ROOT_CHAIN_IDS.includes(chainId), 'Invalid chainId')

  const initCodeHash = keccak256(
    ['bytes'],
    [
      (SupportedChainId.ARBITRUM_ONE ? bytecode : testnetBytecode)
        .concat('000000000000000000000000')
        .concat(account.slice(2)),
    ]
  )

  return getCreate2Address(
    Ulysses[chainId]?.RootPort ?? ZERO_ADDRESS,
    account.concat('000000000000000000000000'),
    initCodeHash
  )
}
