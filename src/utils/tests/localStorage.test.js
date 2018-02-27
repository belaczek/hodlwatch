import { encrypt } from '../crypto'
import { isStringValidExport } from '../localStorage'

test('should validate import string', () => {
  const testState = {
    core: {},
    apiKeys: {}
  }

  const encrypted = encrypt(testState)

  expect(isStringValidExport(encrypted)).toBe(true)
})

test('should validate import string as invalid', () => {
  const testState = {
    bla: {},
    apiKeys: {}
  }

  const encrypted = encrypt(testState)

  expect(isStringValidExport(encrypted)).toBe(false)
})
