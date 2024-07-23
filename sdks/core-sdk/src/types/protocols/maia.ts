import { IProtocolAddresses, ProtocolAddressesType } from '../basic'

/**
 * This interface represents the addresses surrounding the Maia protocol .
 */
export interface IMaia extends IProtocolAddresses {
  /**
   * The address of the Maia Token
   */
  Maia: string

  /**
   * The address of the vMaia Token
   */
  vMaia: string

  /**
   * The address of the vMaiaVotes Token
   */
  vMaiaVotes: string

  /**
   * The address of the vMaiaTest Token
   */
  vMaiaTest: string

  /**
   * The address of the vMaiaVotesTest Token
   */
  vMaiaVotesTest: string
}

export type MaiaAddressesType = ProtocolAddressesType<IMaia>
