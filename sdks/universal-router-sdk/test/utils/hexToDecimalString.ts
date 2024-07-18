import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export function hexToDecimalString(hex: BigNumberish) {
  return BigNumber.from(hex).toString()
}
