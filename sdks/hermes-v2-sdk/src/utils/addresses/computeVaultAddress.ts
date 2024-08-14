import { getCreate2Address } from '@ethersproject/address'
import invariant from 'tiny-invariant'

/**
 * Computes a vault address
 * @param factoryAddress The Vault factory address
 * @param underlying The underlying token of the vault
 * @param initCodeHash The init code hash used to compute the vault address
 * @returns The vault address
 */
export function computeVaultAddress({
  factoryAddress,
  underlying,
  initCodeHash,
}: {
  factoryAddress: string
  underlying: string
  initCodeHash: string
}): string {
  invariant(!!factoryAddress, 'Invalid factory address')
  invariant(!!initCodeHash, 'Invalid init code hash')

  return getCreate2Address(factoryAddress, underlying + '000000000000000000000000', initCodeHash)
}
