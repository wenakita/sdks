import { TalosAddressesType } from '../../types'
import { SupportedChainId } from '../chainIds'

export const TalosAddresses: TalosAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: {
    TalosStrategyStakedFactory: '0x17B4f847f9B071298f3eF0DAd5FCB20453bd537D',
    OptimizerFactory: '0x000000005De908d83F4b6072D388e3e9Fc543557',
    BoostAggregatorFactory: '0x223F3862F28848784432dc48346d133aBA94fbD4',
    TalosManagerFactory: '0x00780F4E0084BfE000Df008A0081E900E2f1C632',
    FlywheelCoreInstant: '0x340297150A933c474d98dcf92F5e583C4D48E4FE',
    TransferAll: '0x000067eadd040000d8ee00c1b9ca41ef920c005c',
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
