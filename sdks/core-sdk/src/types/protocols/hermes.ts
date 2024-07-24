import { IProtocolAddresses, ProtocolAddressesType } from '../basic'

/**
 *
 * This interface represents the addresses of the Hermes protocol on different chains.
 * It extends the IProtocolAddresses interface, which is a map of chain IDs to addresses.
 *
 */
export interface IHermes extends IProtocolAddresses {
  /**
   * The address of the Hermes Token
   */
  Hermes: string

  /**
   * The address of the bHermes Token
   */
  bHermes: string

  /**
   * The address of the bHermesVotes Token
   */
  bHermesVotes: string

  /**
   * The address of the bHermesGauges Token
   */
  bHermesGauges: string

  /**
   * The address of the bHermesBoost Token
   */
  bHermesBoost: string

  /**
   * The address of the UniswapV3GaugeFactory
   */
  UniswapV3GaugeFactory: string

  /**
   * The address of the UniswapV3Staker
   */
  UniswapV3Staker: string

  /**
   * The address of the BribesFactory which is used to create Bribes
   */
  BribesFactory: string

  /**
   * The address of the FlywheelBooster which is used to manage balances for bribes
   */
  FlywheelBooster: string

  /**
   * The address of the BaseV2Minter
   */
  BaseV2Minter: string

  /**
   * The address of the BaseV2GaugeManager
   */
  BaseV2GaugeManager: string

  /**
   * The address of the PartnerManagerFactory
   */
  PartnerManagerFactory: string

  /**
   * The address of the FlywheelGaugeRewards
   */
  FlywheelGaugeRewards: string

  /**
   * The address of the RewardsInfoHelper
   */
  RewardsInfoHelper: string

  /**
   * The address of the ERC20BoostHelper
   */
  ERC20BoostHelper: string

  /**
   * The address of the RestakeHelper
   */
  RestakeHelper: string

  /**
   * The address of the FlywheelHelper
   */
  FlywheelHelper: string
}

export type HermesAddressesType = ProtocolAddressesType<IHermes>
