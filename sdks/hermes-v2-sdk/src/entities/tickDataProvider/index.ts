import { BigintIsh } from 'maia-core-sdk'

import { TickDataProvider } from '../../types/tickDataProvider'

/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
export class NoTickDataProvider implements TickDataProvider {
  private static ERROR_MESSAGE = 'No tick data provider was given'
  async getTick(_tick: number): Promise<{ liquidityNet: BigintIsh }> {
    throw new Error(NoTickDataProvider.ERROR_MESSAGE)
  }

  async nextInitializedTickWithinOneWord(
    _tick: number,
    _lte: boolean,
    _tickSpacing: number
  ): Promise<[number, boolean]> {
    throw new Error(NoTickDataProvider.ERROR_MESSAGE)
  }
}
