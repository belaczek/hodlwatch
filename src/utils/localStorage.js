// @ts-ignore
import { pick, keys, reduce } from 'lodash/fp'
import { decrypt, encrypt } from './crypto'

const STATE = 'state'

/**
 * Load state from storage
 */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STATE)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (e) {
    return undefined
  }
}

/**
 * Persist state in localStorage
 * @param {object | string} state
 */
export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STATE, serializedState)
  } catch (e) {}
}

export const clearStorage = () => {
  try {
    localStorage.removeItem(STATE)
  } catch (e) {}
}

// Decrypt wrapper (it uses JSON.parse)
const getDecryptedJSON = (value, passphrase) => {
  try {
    return decrypt(value, passphrase)
  } catch (e) {
    return false
  }
}

// Array of required keys in imported settings
const requiredStateKeys = ['core']

/**
 * Check if a string is valid to import as a state
 * Might make the validation more robust later
 * @param {string} value
 * @param {string} [passphrase='']
 */
export const isStringValidExport = (value, passphrase) => {
  try {
    const decrypted = keys(decrypt(value, passphrase))
    return reduce((acc, val) => acc && decrypted.includes(val), true)(
      requiredStateKeys
    )
  } catch (e) {
    return false
  }
}

// parse state object to only contain properties we want to export/import
const parsePersistState = pick(['apiKeys', 'core'])

/**
 * Import state into the localstorage
 * @param {string} state
 * @param {string} [passphrase='']
 */
export const importStoreData = (state, passphrase) => {
  const storeData = getDecryptedJSON(state, passphrase)

  if (storeData) {
    const persistState = parsePersistState(storeData)
    saveState(persistState)
    return true
  } else {
    return false
  }
}

/**
 * Export current app state into string which can be imported into another app instance
 * @param {string} [passphrase='']
 */
export const exportStoreData = passphrase => {
  const state = parsePersistState(loadState())

  return encrypt(state, passphrase)
}

export default {
  saveState,
  loadState,
  clearStorage,
  importStoreData,
  isStringValidExport,
  exportStoreData
}
