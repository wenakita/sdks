import { IEcosystemProtocols } from '../../types'
import { BalancerAddresses } from './BalancerAddresses'
import { HermesAddresses } from './HermesAddresses'
import { MaiaAddresses } from './MaiaAddresses'
import { TalosAddresses } from './TalosAddresses'
import { Ulysses } from './UlyssesAddresses'

/**
 * Exports all the addresses for the different protocols
 */
export const EcosystemProtocols: IEcosystemProtocols = {
  Hermes: HermesAddresses,
  Maia: MaiaAddresses,
  Talos: TalosAddresses,
  Balancer: BalancerAddresses,
  Ulysses,
}
