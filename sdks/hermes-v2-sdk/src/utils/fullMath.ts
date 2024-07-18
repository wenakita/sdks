import JSBI from 'jsbi'
import { ONE, ONE_18, ZERO } from 'maia-core-sdk'

const _require = (b: boolean, message: string) => {
  if (!b) throw new Error(message)
}

export abstract class FullMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static mulDivRoundingUp(a: JSBI, b: JSBI, denominator: JSBI): JSBI {
    const product = JSBI.multiply(a, b)
    let result = JSBI.divide(product, denominator)
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE)
    return result
  }

  // This is the same as mulDown in Smart Contracts FixedPoint.sol
  static mulDownFixed(a: JSBI, b: JSBI): JSBI {
    const product = JSBI.multiply(a, b)
    _require(JSBI.equal(a, ZERO) || JSBI.equal(JSBI.divide(product, a), b), 'Errors.MUL_OVERFLOW')

    return JSBI.divide(product, ONE_18)
  }

  static mulUpFixed(a: JSBI, b: JSBI): JSBI {
    const product = JSBI.multiply(a, b)
    _require(JSBI.equal(a, ZERO) || JSBI.equal(JSBI.divide(product, a), b), 'Errors.MUL_OVERFLOW')

    if (JSBI.equal(product, ZERO)) {
      return ZERO
    } else {
      // The traditional divUp formula is:
      // divUp(x, y) := (x + y - 1) / y
      // To avoid intermediate overflow in the addition, we distribute the division and get:
      // divUp(x, y) := (x - 1) / y + 1
      // Note that this requires x != 0, which we already tested for.

      return JSBI.add(JSBI.divide(JSBI.subtract(product, ONE), ONE_18), ONE)
    }
  }

  // Modification: Taken from the fixed point class
  // Same as divDown in Smart Contract FixedPoint.sol
  static divDownFixed(a: JSBI, b: JSBI): JSBI {
    _require(b != ZERO, 'Errors.ZERO_DIVISION')
    if (JSBI.equal(a, ZERO)) {
      return ZERO
    } else {
      const aInflated = JSBI.multiply(a, ONE_18)
      // _require(aInflated / a == ONE, Errors.DIV_INTERNAL); // mul overflow

      return JSBI.divide(aInflated, b)
    }
  }

  // Modification: Taken from the fixed point class
  static divUpFixed(a: JSBI, b: JSBI): JSBI {
    _require(b != ZERO, 'Errors.ZERO_DIVISION')

    if (JSBI.equal(a, ZERO)) {
      return ZERO
    } else {
      const aInflated = JSBI.multiply(a, ONE_18)
      _require(JSBI.equal(JSBI.divide(aInflated, a), ONE_18), 'Errors.DIV_INTERNAL') // mul overflow

      // The traditional divUp formula is:
      // divUp(x, y) := (x + y - 1) / y
      // To avoid intermediate overflow in the addition, we distribute the division and get:
      // divUp(x, y) := (x - 1) / y + 1
      // Note that this requires x != 0, which we already tested for.

      return JSBI.add(JSBI.divide(JSBI.subtract(aInflated, ONE), b), ONE)
    }
  }
}
