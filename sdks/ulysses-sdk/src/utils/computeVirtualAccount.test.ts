import { SupportedChainId } from 'maia-core-sdk'

import { computeVirtualAccount } from './computeVirtualAccount'

describe('computeVirtualAccount', () => {
  const ADDRESS_TEST_ONE = '0x88E07a0457aA113AB910103d9a01217315DA1C98'
  const ADDRESS_TEST_TWO = '0xC466af7ff16ef0f1A7fa4E23E095E47a4058D791'

  describe('#compute', () => {
    it('compute works fine testnet', () => {
      const VIRTUAL_ACCOUNT_TESTNET_ONE = '0x6639b02F5caf6cF25a8FF54246Fa988768126112'
      const VIRTUAL_ACCOUNT_TESTNET_TWO = '0x286aC68E8c5DA673D222807da61e671C621f2a99'

      const testRootChainId = SupportedChainId.SEPOLIA

      expect(computeVirtualAccount(ADDRESS_TEST_ONE, testRootChainId)).toEqual(VIRTUAL_ACCOUNT_TESTNET_ONE)
      expect(computeVirtualAccount(ADDRESS_TEST_TWO, testRootChainId)).toEqual(VIRTUAL_ACCOUNT_TESTNET_TWO)
    })
  })
})
