// @ts-ignore
import { pipe, map, filter, pick } from 'lodash/fp'

/**
 * Asynchronously load ccxt module to reduce initial page load
 * After the first load, module is cached in browser and served imediately
 * @returns {Promise<Object>} ccxt instance
 */
const getCcxt = async () => {
  const ccxt = await import('ccxt')
  return ccxt
}

const defaultApiCredentials = {
  apiKey: true,
  secret: true,
  uid: false,
  password: false
}

/**
 * Get instance of exchange api service
 * @returns {Promise<Object|Error>} List of supported service functions
 */
export default async function getExchangeApiService () {
  const service = await getCcxt()

  /**
   * Instantiate exchange
   * @param {string} exchangeId
   * @param {Object} [config] Api credentials, proxy etc.
   */
  const getExchangeInstance = (exchangeId, config) => {
    if (exchangeId && service[exchangeId]) {
      return new service[exchangeId](config)
    } else {
      console.log(`Exchange ${exchangeId} is not supported`)
      return false
    }
  }

  /**
   * Fetch balance of target account
   * @param {string} exchangeId
   * @param {Object} apiCredentials
   * @returns {Promise<Object|Error>} accountBalance
   */
  const fetchExchangeAccountBalance = async (exchangeId, apiCredentials) => {
    const exchangeInstance = getExchangeInstance(exchangeId, apiCredentials)
    return exchangeInstance.fetchBalance()
  }

  /**
   * Test connection to target exchange private api by trying to fetch account balance
   * @param {string} exchangeId
   * @param {Object} apiCredentials
   * @returns {Promise<Object|Error>} test result
   */
  const testExchangeConnection = async (exchangeId, apiCredentials) => {
    try {
      const data = await fetchExchangeAccountBalance(exchangeId, apiCredentials)
      return data
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  /**
   * Check if exchange is compatible with this app
   * @param {Object} exchangeInstance
   * @returns {Boolean}
   */
  const exchangeIsCompatible = exchangeInstance =>
    exchangeInstance.has.CORS &&
    exchangeInstance.has.privateAPI &&
    exchangeInstance.has.fetchBalance

  /**
   * @typedef {Object} ExchangesList
   * @property {string} id
   * @property {string} name
   */

  /**
   * Get list of supported exchanges
   * @returns {ExchangesList} exchgangesList
   */
  const getExchangesList = () =>
    pipe(
      map(getExchangeInstance),
      filter(exchangeIsCompatible),
      map(pick(['id', 'name']))
    )(service.exchanges)

  /**
   * Get api credentials requirements
   * @param {string} exchangeId
   * @returns {Object} Required api keys
   */
  const getExchangeRequiredCredentialsList = exchangeId => {
    if (exchangeId) {
      const instance = getExchangeInstance(exchangeId)
      if (instance) {
        return instance.requiredCredentials
      }
    } else return defaultApiCredentials
  }

  return {
    fetchExchangeAccountBalance,
    testExchangeConnection,
    getExchangesList,
    getExchangeInstance,
    getExchangeRequiredCredentialsList
  }
}
