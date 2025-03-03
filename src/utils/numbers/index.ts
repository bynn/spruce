/**
 * toDecimal takes a string or number that represents a percentage value and returns a float
 * @param value - A string or number that represents a percentage value.
 * @return {number} A float representing the percentage value.
 * @example
 * toDecimal("50") // => 0.5
 * toDecimal("100") // => 1.0
 */
const toDecimal = (value: string | null): number => {
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return null;
  }
  return number / 100;
};

/**
 *
 * @param value - A string or number that represents a percentage value between 0 and 1.
 * @return {number} A float representing the percentage value.
 * @example
 * toPercentage("0.5") // => 50
 * toPercentage("1") // => 100
 */
const toPercent = (value: string | number): number => {
  if (typeof value === "number") {
    return value * 100;
  }
  return parseFloat(value) * 100;
};

/**
 * formatZeroIndexForDisplay Formats a zero-indexed number for display in the UI.
 */
const formatZeroIndexForDisplay = (value: number): number => value + 1;

export { toDecimal, toPercent, formatZeroIndexForDisplay };
