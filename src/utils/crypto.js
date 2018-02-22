import AES from 'crypto-js/AES'
import Utf8 from 'crypto-js/enc-utf8'

/**
 * Encrypt an object
 * @param {Object} value object
 * @param {string} [passphrase]
 * @returns {string} encrypted object
 */
export const encrypt = (value = {}, passphrase = '') => {
  const stringified = JSON.stringify(value)
  return AES.encrypt(stringified, passphrase).toString()
}

/**
 * Decrypt cipher to js object
 * @param {string} value AES cipher
 * @param {string} passphrase
 * @returns {Object}
 */
export const decrypt = (value, passphrase = '') => {
  const decrypted = AES.decrypt(value, passphrase)
  return JSON.parse(decrypted.toString(Utf8))
}

/**
 * This module provides utility functions to encrypt/decrypt object
 * To be used mainly to encrypt persisted redux store
 */
export default {
  encrypt,
  decrypt
}
