export function mulDivUp(x: bigint, y: bigint, div: bigint) {
  const mul = x * y
  if (mul % div === BigInt(0)) {
    return mul / div
  } else {
    return mul / div + BigInt(1)
  }
}
