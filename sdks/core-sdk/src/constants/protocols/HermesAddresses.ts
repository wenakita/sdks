import { HermesAddressesType, IHermes } from '../../types'
import { SupportedChainId } from '../chainIds'

/**
 * These addresses are on arbitrum
 */
export const ArbitrumHermesAddresses: IHermes = {
  Hermes: '0x45940000009600102A1c002F0097C4A500fa00AB',
  bHermes: '0x3A0000000000E1007cEb00351F65a1806eCd937C',
  bHermesVotes: '0x5B99ACF131463bFc62FE000b8Bb962097B6734d9',
  bHermesGauges: '0xe6D0aeA7cEf79B08B906e0C455C25042b57b23Ed',
  bHermesBoost: '0x73A899D7e71393dDf2B1cD8336f820969c709E70',
  UniswapV3GaugeFactory: '0xE64278005e0F00cd6199d000386b018d7C000000',
  UniswapV3Staker: '0x54De3b7b5D1993Db4B2a93C897b5272FBd60e99E',
  BribesFactory: '0x863011414b400340178Ec329647a2aa55f724D70',
  FlywheelBooster: '0x006f48258FC9562F00003b9700009231008b0600',
  BaseV2Minter: '0x000000B473F20DEA03618d00315900eC5900dc59',
  BaseV2GaugeManager: '0x0000070059ed0005981800C8d66017bC00500632',
  PartnerManagerFactory: '0x8c272715be844488Ff7AAf201d51D8FA50149387',
  FlywheelGaugeRewards: '0x000000b53E67c90000e1C22e1530c70020657Ff7',
  RewardsInfoHelper: '0x3219f8cf74ABb16D7C0923dE58a48Edde997D9Db',
  ERC20BoostHelper: '0x127991cC764B05fe6C9257A0EC3Be9E4f48Ad744',
  RestakeHelper: '0xCc06B09F822eeC7aD6c30C59c060647C3Aab2D06',
  FlywheelHelper: '0xf3f35E27AE1B3ab928327F72391B29f1bFd8DAF6',
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
