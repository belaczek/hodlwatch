import { encryptObject, decryptToObject } from 'utils/crypto'

test('should encrypt and decrypt to the same value', () => {
  const passphrase = 'password'
  const testObject = {
    value1: 4,
    value3: {
      xx: 3,
      yy: [3, 4, 5, 66, 'a']
    }
  }

  const cipher = encryptObject(testObject, passphrase)
  const newObject = decryptToObject(cipher, passphrase)

  expect(newObject).toEqual(testObject)
})

test('should encrypt and decrypt using no password', () => {
  const testObject = {
    value1: 4,
    value3: {
      xx: 3,
      yy: [3, 4, 5, 66, 'a']
    }
  }

  const cipher = encryptObject(testObject)
  const newObject = decryptToObject(cipher)

  expect(newObject).toEqual(testObject)
})

test('should encrypt/decrypt non-object value', () => {
  const passphrase = 'password'
  const testObject = 25

  const cipher = encryptObject(testObject, passphrase)
  const newObject = decryptToObject(cipher, passphrase)

  expect(newObject).toEqual(testObject)
})

test('should encrypt/decrypt empty value', () => {
  const passphrase = 'password'
  const testObject = null

  const cipher = encryptObject(testObject, passphrase)
  const newObject = decryptToObject(cipher, passphrase)

  expect(newObject).toEqual(testObject)
})
