import { SupportedChainId } from 'maia-core-sdk'

import { computeVirtualAccount } from './computeVirtualAccount'

describe('computeVirtualAccount', () => {
  const ADDRESS_TEST_ONE = '0x03f27017e164f9bf4c9fc0a52a26f1b65cbe970e'
  const ADDRESS_TEST_TWO = '0xC466af7ff16ef0f1A7fa4E23E095E47a4058D791'

  describe('#compute', () => {
    it('compute works fine testnet', () => {
      const VIRTUAL_ACCOUNT_TESTNET_ONE = '0x17818160B6eE49656Adc9528131b6D33fd95642F'
      const VIRTUAL_ACCOUNT_TESTNET_TWO = '0x066DFbFcFBb73912F7eA48675584FaDdB215983d'

      const testRootChainId = SupportedChainId.SEPOLIA

      expect(computeVirtualAccount(ADDRESS_TEST_ONE, testRootChainId)).toEqual(VIRTUAL_ACCOUNT_TESTNET_ONE)
      expect(computeVirtualAccount(ADDRESS_TEST_TWO, testRootChainId)).toEqual(VIRTUAL_ACCOUNT_TESTNET_TWO)
    })
  })
})
