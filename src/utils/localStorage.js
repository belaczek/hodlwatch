// @ts-ignore
import { pick, keys, reduce, get } from 'lodash/fp'
import { decrypt, encrypt } from './crypto'
import { getInitializedCoreState } from 'store/modules/core'

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
const requiredStateKeys = ['apiKeys']

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

// parse state object to only contain properties relevant for export
const parseExportState = pick(['apiKeys'])

// parse imported state into correct shape
const parseImportState = importState => ({
  core: getInitializedCoreState(),
  apiKeys: get('apiKeys', importState) || {}
})

/**
 * Import state into the localstorage
 * @param {string} state
 * @param {string} [passphrase='']
 */
export const importStoreData = (state, passphrase) => {
  const storeData = getDecryptedJSON(state, passphrase)

  if (!storeData) return false

  const persistState = parseImportState(storeData)
  saveState(persistState)
  return true
}

/**
 * Export current app state into string which can be imported into another app instance
 * @param {string} [passphrase='']
 */
export const exportStoreData = passphrase => {
  const state = parseExportState(loadState())

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
