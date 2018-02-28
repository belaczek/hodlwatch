import {
  sum,
  multiply,
  roundValue,
  percentageChange,
  absoluteChange
} from '../calcFloat'

test('should sum two numbers', () => {
  expect(sum(1, 2)).toBe(3)
})

test('should sum two float numbers', () => {
  expect(sum(1.2, 2.3)).toBe(3.5)
})

test('should sum two numbers in various formats', () => {
  expect(sum(2.00000000000001, '0.00000000000001')).toBe(2.00000000000002)
})

test('should return when one param is missing', () => {
  expect(sum(1.2)).toBe(1.2)
})

test('should multiply two numbers', () => {
  expect(multiply(2, 2)).toBe(4)
})

test('should multiply two numbers', () => {
  expect(multiply(0.000001, 2)).toBe(0.000002)
})

test('should multiply two numbers', () => {
  expect(multiply('1.01', '0.1')).toBe(0.101)
})

test('should multiply by zero', () => {
  expect(multiply('1.01', 0)).toBe(0)
})

test('should return when second param is missing', () => {
  expect(multiply('1.01')).toBe(1.01)
})

test('should return rounded value', () => {
  expect(roundValue('1.011')).toBe(1.01)
})

test('should return rounded value', () => {
  expect(roundValue('0.00000000000001')).toBe(0)
})

test('should return rounded value', () => {
  expect(roundValue(1.015)).toBe(1.02)
})

test('should return rounded value', () => {
  expect(roundValue(0.2)).toBe(0.2)
})

test('should calculate correct percentage', () => {
  expect(percentageChange(10, 20)).toBe(100)
})

test('should calculate correct percentage', () => {
  expect(percentageChange(11, 21)).toBe(90.91)
})

test('should calculate negative percentage change', () => {
  expect(percentageChange(21, 11)).toBe(-47.62)
})

test('should not fail when dividing by zero', () => {
  expect(percentageChange(0, 11)).toBe(0)
})

test('should get absolute difference', () => {
  expect(absoluteChange(0, 11)).toBe(11)
})

test('should get absolute difference', () => {
  expect(absoluteChange(11.1111, 0)).toBe(-11.11)
})
