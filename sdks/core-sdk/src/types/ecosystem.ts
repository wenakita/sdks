import { IArbitrumProtocols } from './arbitrum'
import { IUlysses } from './protocols/ulysses'

// The overall ecosystem structure.
export interface IEcosystemProtocols extends IArbitrumProtocols {
  Ulysses: IUlysses
}
