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
  },

  [SupportedChainId.SEPOLIA]: {
    TalosStrategyStakedFactory: '0xdB51f53819E6a8580C161B65f117743f1D311832',
    OptimizerFactory: '0x9b41164789B5DDC4f2a8ABF32B879986928D000D',
    BoostAggregatorFactory: '0x64C0432f47cC6135a3828C7DFA66d81DDb4D894F',
    TalosManagerFactory: '0xB5Ae0AD4955f1e9446009502A654AD6FA4560Fe5',
    FlywheelCoreInstant: '0xef800796E2b08fA3a0b67a8Caa3A63ed3d682A83',
  },
}
