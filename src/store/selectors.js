// @ts-ignore
import {
  pipe,
  map,
  filter,
  isEmpty,
  getOr,
  get,
  keys,
  reduce,
  pick,
  memoize,
  isFunction
} from 'lodash/fp'

import { createSelector } from 'reselect'
import {
  exchangesListSelector,
  exchangeByIdSelector
} from './modules/exchanges'
import { apiKeysSelector } from './modules/apiKeys'
import { activeExchangeFilterIdSelector } from './modules/core'
import {
  histoDataStateSelector,
  currentPriceDataStateSelector
} from './modules/priceData'
import { portfolioSymbolsSelector } from './modules/portfolio'
import {
  multiply,
  sum,
  roundValue,
  percentageChange,
  absoluteChange
} from 'utils/calcFloat'

/* SELECTOR HELPERS */

/**
 * Calculate total values of symbols by multiplying them by current price
 * @param {Object} prices
 * @param {Object} symbols
 * @return {number}
 */
const calculateTotalValue = (prices, symbols) => {
  if (isEmpty(prices) || isEmpty(symbols)) {
    return 0
  }
  return pipe(
    keys,
    map(key => multiply(getOr(0, key, symbols), getOr(0, key, prices))),
    reduce(sum, 0)
  )(symbols)
}

/**
 * Merge histoData into one object at target index
 * @param {Object} histoData
 * @param {number} index
 * @param {function} [priceTransform=identity] function with params (price, key) for setting custom value into price field
 * @returns {Object} returns an object of the same shape as currentPrice record
 */
const mergeHistoData = (histoData = {}, index = 0, priceTransform) => {
  // If no priceTransform function is provided, use price identity
  priceTransform = isFunction(priceTransform) ? priceTransform : x => x
  return pipe(
    keys,
    reduce((acc, key) => {
      const timeRecord = get([key, index], histoData)
      acc[key] = priceTransform(get('close', timeRecord), key)
      acc.time = acc.time || get('time', timeRecord)
      return acc
    }, {})
  )(histoData)
}

/**
 * Merge all histoData into an array of objects by timestamp
 * @param {Object} histoData
 * @param {function} [priceTransform=identity] function with params (price, key) for setting custom value into price field
 * @returns {Array<Object>} returns an object of the same shape as currentPrice record
 */
const mergeAllHistoData = (histoData, priceTransform) => {
  const dataKeys = keys(histoData)

  // Expecting that all keys have the same history depth
  const historyLength = histoData[dataKeys[0]] || []

  return historyLength.map((_, i) =>
    mergeHistoData(histoData, i, priceTransform)
  )
}

/* SELECTORS */

/**
 * Store selectors which reach for data into multiple modules
 */

export const savedExchangesListSelector = state => {
  const exchanges = exchangesListSelector(state)
  return pipe(
    apiKeysSelector,
    map(({ exchangeId }) => ({ ...exchanges.find(ex => ex.id === exchangeId) }))
  )(state)
}

export const unusedExchangesListSelector = state => {
  const apiKeys = apiKeysSelector(state)
  return pipe(exchangesListSelector, filter(({ id }) => isEmpty(apiKeys[id])))(
    state
  )
}

export const activeExchangeFilterSelector = createSelector(
  activeExchangeFilterIdSelector,
  exchangeByIdSelector
)

/**
 * Select histo data
 * This is the main selector for selecting histo data
 */
export const histoDataSelector = ({ exchangeId = null, symbol = null } = {}) =>
  createSelector(
    portfolioSymbolsSelector({ exchangeId, symbol }),
    histoDataStateSelector,
    (symbols, priceData) => {
      const symKeys = keys(symbols)
      return pick(symKeys, priceData)
    }
  )

/**
 * Select current price data
 * This is the main selector for selecting current price data
 */
export const currentPriceDataSelector = ({
  exchangeId = null,
  symbol = null
} = {}) =>
  createSelector(
    portfolioSymbolsSelector({ exchangeId, symbol }),
    currentPriceDataStateSelector,
    (symbols, priceData) => {
      const symKeys = keys(symbols)
      return pick(symKeys, priceData)
    }
  )

/**
 * Parse histoData into chart data
 * @param {Object} histoPrices
 * @param {Object} currentPrices
 * @param {Object} symbols
 */
const parseHistoDataToChartData = memoize(
  (histoPrices, currentPrices, symbols) => {
    if (isEmpty(histoPrices) || isEmpty(symbols)) {
      return
    }

    let chartData = []

    chartData = mergeAllHistoData(histoPrices, (price, key) => {
      const marketValue = multiply(price, get([key], symbols))
      return roundValue(marketValue)
    })

    // TODO parse current price as well
    // if (currentPrices) {
    //   chartData.push({
    //     ...symbolKeys.map(symKey=> ({})),
    //     time: formatDate(new Date())
    //   })
    // }

    return chartData
  }
)

/**
 * Select histoData by provided filter, calculate market values and parse it into chart data structure
 * @param {Object} param0
 */
export const chartDataMarketValueSelector = ({ exchangeId, symbol }) =>
  createSelector(
    histoDataSelector({ exchangeId, symbol }),
    currentPriceDataSelector({ exchangeId, symbol }),
    portfolioSymbolsSelector({ exchangeId, symbol }),
    parseHistoDataToChartData
  )

/**
 * Select total market value
 * Filter by exchangeId or symbol
 * When no filter provided, calculate for all data in store
 * @param {Object} param0
 */
export const marketValueSelector = ({ exchangeId, symbol }) =>
  createSelector(
    currentPriceDataSelector({ exchangeId, symbol }),
    portfolioSymbolsSelector({ exchangeId, symbol }),
    calculateTotalValue
  )

/**
 * Get performance for target filtered symbols
 * @param {*} param0
 * @returns {object}
 */
export const portfolioPerformanceSelector = ({ exchangeId, symbol }) =>
  createSelector(
    currentPriceDataSelector({ exchangeId, symbol }),
    histoDataSelector({ exchangeId, symbol }),
    portfolioSymbolsSelector({ exchangeId, symbol }),
    (currentPriceData, histoData, symbolAmounts) => {
      const histoPrices = mergeHistoData(histoData, 0)

      const histoTotalValue = calculateTotalValue(histoPrices, symbolAmounts)
      const currentTotalValue = calculateTotalValue(
        currentPriceData,
        symbolAmounts
      )

      return {
        absolute: absoluteChange(histoTotalValue, currentTotalValue),
        relative: percentageChange(histoTotalValue, currentTotalValue)
      }
    }
  )

export default {
  savedExchangesListSelector,
  unusedExchangesListSelector,
  activeExchangeFilterSelector,
  histoDataSelector,
  currentPriceDataSelector,
  marketValueSelector,
  chartDataMarketValueSelector,
  portfolioPerformanceSelector
}
