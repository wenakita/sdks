import { getCreate2Address } from '@ethersproject/address'

import { VAULT_INIT_CODE_HASH } from '../../constants/constants'

/**
 * Computes a vault address
 * @param factoryAddress The Vault factory address
 * @param underlying The underlying token of the vault
 * @param initCodeHashManualOverride Override the init code hash used to compute the vault address if necessary
 * @returns The vault address
 */
export function computeVaultAddress({
  factoryAddress,
  underlying,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  underlying: string
  initCodeHashManualOverride?: string
}): string {
  return getCreate2Address(
    factoryAddress,
    underlying + '000000000000000000000000',
    initCodeHashManualOverride ?? VAULT_INIT_CODE_HASH
  )
}
