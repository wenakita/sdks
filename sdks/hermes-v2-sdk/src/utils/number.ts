export const formatBigInt = (value: bigint, { decimals = 18, precision = 2 } = {}) => {
  return (Number(value) / 10 ** decimals).toFixed(precision)
}
