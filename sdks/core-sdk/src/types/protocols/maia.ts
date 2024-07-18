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
}

export type MaiaAddressesType = ProtocolAddressesType<IMaia>
