import { HermesAddressesType, IHermes } from '../../types'
import { ZERO_ADDRESS } from '../addresses'
import { SupportedChainId } from '../chainIds'

/**
 * These addresses are on arbitrum
 */
export const ArbitrumHermesAddresses: IHermes = {
  Hermes: ZERO_ADDRESS,
  bHermes: ZERO_ADDRESS,
  bHermesVotes: ZERO_ADDRESS,
  bHermesGauges: ZERO_ADDRESS,
  bHermesBoost: ZERO_ADDRESS,
  UniswapV3GaugeFactory: ZERO_ADDRESS,
  UniswapV3Staker: ZERO_ADDRESS,
  BribesFactory: ZERO_ADDRESS,
  BaseV2Minter: ZERO_ADDRESS,
  PartnerManagerFactory: ZERO_ADDRESS,
  FlywheelGaugeRewards: ZERO_ADDRESS,
}

/**
 * These are the tesnet addresses on Sepolia
 */
export const SepoliaHermesAddresses: IHermes = {
  Hermes: '0xC2dC238083fCc1adAD44090cc0802C94Ca1f25E9',
  bHermes: '0x6B65882F51BD0B5BE9803a3F2e1e895700F371B3',
  bHermesVotes: '0x1A2DC6AA017d6F5b2e538189F655cb2d120dCc4d',
  bHermesGauges: '0x3A8093824b0CDECc9B0c7B0C68B86630dcDe1bEB',
  bHermesBoost: '0x8265Aa10EE11f57ed01Bf8ecE5BA57Ef75ED36dc',
  UniswapV3GaugeFactory: '0x6CFFD0d728deF9BE1640c70776fbE6B93e7E96A2',
  UniswapV3Staker: '0x488ABc69528597bf86A7728aEf17EaaEb9d7E323',
  BribesFactory: '0x67195CB1Be819c5790dc89C2023b21943c702A49',
  BaseV2Minter: '0xB82241b897256d920470b585C555C4341d2B1D4A',
  PartnerManagerFactory: '0xC2080cA61D32663fb698321dEF53C038eFc72964',
  FlywheelGaugeRewards: '0x54994cd7bbA34C8dbD4a0033b99332B665F91CD3',
}

export const HermesAddresses: HermesAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: ArbitrumHermesAddresses,
  [SupportedChainId.SEPOLIA]: SepoliaHermesAddresses,
}
