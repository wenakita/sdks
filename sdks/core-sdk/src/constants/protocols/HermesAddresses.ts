import { HermesAddressesType, IHermes } from '../../types'
import { SupportedChainId } from '../chainIds'

/**
 * These addresses are on arbitrum
 */
export const ArbitrumHermesAddresses: IHermes = {
  Hermes: '0x00000000000451f49c692Bfc24971cAcEA2dB678',
  bHermes: '0x000000000066eA454672f4733407A74B886d3c93',
  bHermesVotes: '0x168edFB07E7FA8FeB3fC14290C242Cb95F4000CD',
  bHermesGauges: '0xf2B83F6a750A6140f26B864C2462e971e5BD18e1',
  bHermesBoost: '0xeA017393Cc43a3c4da9B63A723e20a20c5951573',
  UniswapV3GaugeFactory: '0x0000000000D3D3dB0D56Ed2F2DedDcf90b160e44',
  UniswapV3Staker: '0x76FA1b6bCaB28e8171027aC0f89D7DB870ed07d6',
  BribesFactory: '0x41Bfc1468879278FeC83C24e593Dcea86980b662',
  FlywheelBooster: '0x00000000aaeeC6E2Ef58aEf4508B068e4Fd6C893',
  BaseV2Minter: '0x00000048B124De005d473114569e49A2890Ee600',
  BaseV2GaugeManager: '0x00d79a00000066c81B7Bb200fe004911f9143CfB',
  PartnerManagerFactory: '0xd9232dc7fD8323Dd90D0B89EdcBC5f65460c2315',
  FlywheelGaugeRewards: '0x69547319a5a7E750bD36eCC067ED486cee59fE2C',
  RewardsInfoHelper: '0xA8735913fb61Ca7fd7D6aBdd9ac86C4164e86d9c',
  ERC20BoostHelper: '0xc5054065ca5bd3765f6f1224535F4368DC6bBF41',
  RestakeHelper: '0x000000a98dF39c170A1fa5003B6493E3E148F100',
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
