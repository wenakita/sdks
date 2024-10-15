import { SupportedChainId } from 'maia-core-sdk'

import { computeVirtualAccount } from './computeVirtualAccount'

describe('computeVirtualAccount', () => {
  describe('#compute', () => {
    it('compute works fine mainnet', () => {
      const ADDRESS_TEST_ONE = '0xdABBbF2CC029CEafdc7597bc232Da6fEc4fa3934'
      const ADDRESS_TEST_TWO = '0x00000000206ad3e31DffF979Ccef06dE72a9E027'
      const VIRTUAL_ACCOUNT_ONE = '0xb502131a69C5C1C6855d9A9dfC7a7D430C4A0A3A'
      const VIRTUAL_ACCOUNT_TWO = '0x499788D77E5aAF496039abE1E25fA27b68e8AdD9'

      const rootChainId = SupportedChainId.ARBITRUM_ONE

      expect(computeVirtualAccount(ADDRESS_TEST_ONE, rootChainId)).toEqual(VIRTUAL_ACCOUNT_ONE)
      expect(computeVirtualAccount(ADDRESS_TEST_TWO, rootChainId)).toEqual(VIRTUAL_ACCOUNT_TWO)
    })
    it('compute works fine testnet', () => {
      const ADDRESS_TEST_ONE = '0x88E07a0457aA113AB910103d9a01217315DA1C98'
      const ADDRESS_TEST_TWO = '0xC466af7ff16ef0f1A7fa4E23E095E47a4058D791'
      const VIRTUAL_ACCOUNT_TESTNET_ONE = '0x6639b02F5caf6cF25a8FF54246Fa988768126112'
      const VIRTUAL_ACCOUNT_TESTNET_TWO = '0x286aC68E8c5DA673D222807da61e671C621f2a99'

      const testRootChainId = SupportedChainId.SEPOLIA

      expect(computeVirtualAccount(ADDRESS_TEST_ONE, testRootChainId)).toEqual(VIRTUAL_ACCOUNT_TESTNET_ONE)
      expect(computeVirtualAccount(ADDRESS_TEST_TWO, testRootChainId)).toEqual(VIRTUAL_ACCOUNT_TESTNET_TWO)
    })
  })
})
