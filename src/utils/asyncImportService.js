/**
 * This module provides methods to asynchronously import larger modules.
 * Thanks to this approach, webpack can split source files which helps reduce initial pageload
 */

/**
 * Asynchronously load Main screen container to reduce initial page load
 * @returns {Promise<Object>} MainScreen component
 */
export const importMainAppScreen = async () => {
  const {
    default: MainScreen
  } = await import('containers/MainScreenContainer/')
  return MainScreen
}

/**
 * Asynchronously load exchangeApiService module to reduce initial page load
 * After the first load, module is cached in browser and served imediately
 * @returns {Promise<Object>} ExchangeApiService instance
 */
export const importExchangeApiServiceInstance = async () => {
  const {
    default: getExchangeApiService
  } = await import('utils/exchangeApiService')
  return getExchangeApiService()
}

/**
 * Asynchronously load histoData module to reduce initial page load
 * After the first load, module is cached in browser and served imediately
 * @returns {Promise<Object>} histoDataApiService instance
 */
export const importPriceDataApiService = async () => {
  const priceDataService = await import('utils/priceDataService')
  return priceDataService
}

/**
 * Asynchronously load React-toastify module to reduce initial page load
 * After the first load, module is cached in browser and served imediately
 * @returns {Promise<Object>} react-toastify instance
 */
export const importToastService = async () => {
  const Toastify = await import('react-toastify')
  return Toastify
}

/**
 * Asynchronously load ccxt module to reduce initial page load
 * After the first load, module is cached in browser and served imediately
 * @returns {Promise<Object>} ccxt instance
 */
export const importCcxt = async () => {
  const ccxt = await import('ccxt')
  return ccxt
}

/**
 * Fetch all modules.
 */
export const prefetchAllAssets = async () => {
  await Promise.all([
    // importMainAppScreen(),
    importExchangeApiServiceInstance(),
    importPriceDataApiService(),
    importToastService(),
    importCcxt()
  ])
}
