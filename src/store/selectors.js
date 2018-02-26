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
  memoize
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
import { multiply, sum, roundValue } from 'utils/calcFloat'
import formatDate from 'utils/formatDate'

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
 * Calculate total values of symbols by multiplying them by current price
 * @param {Object} prices
 * @param {Object} symbols
 */
const calculateTotalValue = (prices, symbols) => {
  if (isEmpty(prices) || isEmpty(symbols)) {
    return
  }
  return pipe(
    keys,
    map(key => multiply(getOr(0, key, symbols), getOr(0, key, prices))),
    reduce(sum, 0)
  )(symbols)
}

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

    const symbolKeys = keys(symbols)

    let chartData = []

    if (symbolKeys && symbolKeys.length) {
      const historyDepth = getOr([], [symbolKeys[0]], histoPrices)

      for (let index = 0; index < historyDepth.length; index++) {
        let timestamp = get([symbolKeys[0], index, 'time'], histoPrices)

        let dataRecord = symbolKeys.reduce(
          (acc, value) => ({
            ...acc,
            [value]: roundValue(
              multiply(
                // get holded amount
                getOr(0, [value], symbols),
                // get symbol price for target timestamp
                getOr(0, [value, index, 'close'], histoPrices)
              )
            )
          }),
          { time: formatDate(new Date(timestamp * 1000)) }
        )
        chartData.push(dataRecord)
      }
    }

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

export const portfolioPerformanceSelector = ({ exchangeId, symbol }) =>
  createSelector(
    currentPriceDataSelector({ exchangeId, symbol }),
    histoDataSelector({ exchangeId, symbol }),
    portfolioSymbolsSelector({ exchangeId, symbol }),
    calculateTotalValue
  )

export const symbolValueSelector = symbol => {}

export const portfolioPerformanceByExchangeIdSelector = () => {}

export const symbolPerformanceSelector = () => {}

export default {
  savedExchangesListSelector,
  unusedExchangesListSelector,
  activeExchangeFilterSelector,
  histoDataSelector,
  currentPriceDataSelector,
  marketValueSelector,
  chartDataMarketValueSelector
}
