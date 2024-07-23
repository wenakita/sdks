import { TalosAddressesType } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

export const TalosAddresses: TalosAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: {
    TalosStrategyStakedFactory: ZERO_ADDRESS,
    OptimizerFactory: ZERO_ADDRESS,
    BoostAggregatorFactory: ZERO_ADDRESS,
    TalosManagerFactory: ZERO_ADDRESS,
    FlywheelCoreInstant: ZERO_ADDRESS,
    TransferAll: ZERO_ADDRESS,
  },

  [SupportedChainId.SEPOLIA]: {
    TalosStrategyStakedFactory: '0xA483A5FB7974Dcdc4480a976fECD4e5d21312E20',
    OptimizerFactory: '0xE5534Af145B1F539a89F0a8c210c1213539Aa0Bc',
    BoostAggregatorFactory: '0xA6605f5Ade7eA775535a7e0B54833b7EE6eE98C6',
    TalosManagerFactory: '0x09e2877026cC748c992612b999c4b8A10bfE8Eea',
    FlywheelCoreInstant: '0x090BB8B6a6f8daa1cD1e3153F030F2E7609D4321',
    TransferAll: '0x000bE6db68E716106dAb57190c6A1bF6D3F4cBAf',
  },
}
