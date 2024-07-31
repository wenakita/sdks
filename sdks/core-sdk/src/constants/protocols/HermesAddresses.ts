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
  FlywheelBooster: ZERO_ADDRESS,
  BaseV2Minter: ZERO_ADDRESS,
  BaseV2GaugeManager: ZERO_ADDRESS,
  PartnerManagerFactory: ZERO_ADDRESS,
  FlywheelGaugeRewards: ZERO_ADDRESS,
  RewardsInfoHelper: ZERO_ADDRESS,
  ERC20BoostHelper: ZERO_ADDRESS,
  RestakeHelper: ZERO_ADDRESS,
  FlywheelHelper: ZERO_ADDRESS,
}

/**
 * These are the tesnet addresses on Sepolia
 */
export const SepoliaHermesAddresses: IHermes = {
  Hermes: '0x34CA145f38aBff21679B958fA067DBF3c021a60D',
  bHermes: '0x12bcE9DBFfD8F20b1B7F74c9A5678f770FCb36b8',
  bHermesVotes: '0x4A6D202cd15dD26ca28693Ed8256f5F57fCAf367',
  bHermesGauges: '0xd6154D2C9f5C1e682786aA06c092e9f466f5E068',
  bHermesBoost: '0xE2eaCd92208E81c88E629682aeab5646E4f8ed69',
  UniswapV3GaugeFactory: '0x068cA042b76589A59435C3bd6B5e45D4223453cf',
  UniswapV3Staker: '0x2907fA8B81AD03F07A6545901957e7a9D1dD252B',
  BribesFactory: '0x0A87e91500B1cdC75759ee923054d48dE3df8C0D',
  FlywheelBooster: '0xCff715821ECF15466fC73ee10591D0CcEe2b7f38',
  BaseV2Minter: '0x006a82828debcC1b369B3E41a88F018Ca72dA809',
  BaseV2GaugeManager: '0x996486eA713aCBcD93e0DeD1722F7CF18FeDC0Be',
  PartnerManagerFactory: '0x7049E4743F148d0817Ba82455eC2065E5B97f146',
  FlywheelGaugeRewards: '0xa8C563BA4Eff705f30B631b4cd4A4C4395540d07',
  RewardsInfoHelper: '0x38Ca8f2db851575632B532Ca7EcB3dfffB0E82b0',
  ERC20BoostHelper: '0x07B0ED72AdF6f0912Ce176081b6c7Be93DaA92Eb',
  RestakeHelper: '0x3491CF277310fFbd84fFb3C274C907E78EC6df3B',
  FlywheelHelper: '0xeCC521C10806D02f313443624f0eF66f2eA91A31',
}

export const HermesAddresses: HermesAddressesType = {
  [SupportedChainId.ARBITRUM_ONE]: ArbitrumHermesAddresses,
  [SupportedChainId.SEPOLIA]: SepoliaHermesAddresses,
}
