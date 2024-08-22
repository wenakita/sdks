import { BalancerAddresses, SupportedChainId } from 'maia-core-sdk'

import { computeVaultAddress } from './computeVaultAddress'

describe('#computePoolAddress', () => {
  const factoryAddress = BalancerAddresses[SupportedChainId.ARBITRUM_ONE]?.ComposableStablePoolWrapperFactory!
  const initCodeHash = BalancerAddresses[SupportedChainId.ARBITRUM_ONE]?.ComposableStablePoolWrapperInitCodeHash!
  it('should correctly compute the vault address', () => {
    const underlying = '0xC71FAe5853fa2416b37728D73B51E17A32691E45'

    const result = computeVaultAddress({
      factoryAddress,
      underlying,
      initCodeHash,
    })

    expect(result).toEqual('0x9fa578DBf15C86b1eE599aa4507251311fd6FD37')
  })
})
