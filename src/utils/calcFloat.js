import Big from "big.js";

/**
 * Methods for precise calculations of float numbers
 */

/**
 * Sum two values
 * @param {number | string} first
 * @param {number | string} second
 * @returns {number}
 */
export const sum = (first = 0, second = 0) =>
  // @ts-ignore
  parseFloat(Big(first).plus(second));

/**
 * Multiply two values
 * @param {number | string} first
 * @param {number | string} second
 * @returns {number}
 */
export const multiply = (first = 0, second = 1) =>
  // @ts-ignore
  parseFloat(Big(first).times(second));

/**
 * Round value to two decimal places
 * @param {number|string} value
 * @returns {number}
 */
export const roundValue = (value = 0) =>
  parseFloat(
    // @ts-ignore
    Big(value).round(2)
  );

/**
 * Calculate relative change in percentage between the first and the second argument
 * @param {*} first
 * @param {*} second
 */
export const percentageChange = (first, second) => {
  if (first === 0) {
    return 0;
  }
  return parseFloat(
    // @ts-ignore
    Big(second)
      .div(first)
      .times(100)
      .minus(100)
      .round(2)
  );
};

/**
 * Calculate absolute change between the first and the second argument
 * @param {*} first
 * @param {*} second
 */
export const absoluteChange = (first, second) =>
  parseFloat(
    // @ts-ignore
    Big(second)
      .minus(first)
      .round(2)
  );
