// @ts-ignore
import { getOr, get } from 'lodash/fp'
import { clearStorage } from 'utils/localStorage'
import { DEFAULT_QUOTE_SYMBOL, QUOTE_SYMBOL_LIST } from 'appConstants'

// Action constants
const INIT_APP = 'INIT_APP'
const UPDATE_SERVICE_WORKER = 'UPDATE_SERVICE_WORKER'
const SET_EXCHANGE_FILTER = 'SET_EXCHANGE_FILTER'
const SET_SYMBOL_FILTER = 'SET_SYMBOL_FILTER'
const SET_QUOTE_CURRENCY = 'SET_QUOTE_CURRENCY'

const initialState = {
  init: false, // Indicates if the app was initialized
  serviceWorkerUpdated: false, // Indicates update from serviceWorker
  exchangeFilterId: null, // Global filter by exchange id
  symbolFilterId: null, // Global filter by symbol id
  quoteSymbol: DEFAULT_QUOTE_SYMBOL // Global quote symbol, defaults to USD
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INIT_APP: {
      return { ...state, init: true }
    }

    case UPDATE_SERVICE_WORKER: {
      return {
        ...state,
        serviceWorkerUpdated: true
      }
    }
    case SET_EXCHANGE_FILTER: {
      const exchangeId = action.payload
      return {
        ...state,
        // Right now only one type of filter is allowed at a time
        exchangeFilterId: exchangeId,
        symbolFilterId: null
      }
    }
    case SET_SYMBOL_FILTER: {
      const coinId = action.payload
      return {
        ...state,
        // Right now only one type of filter is allowed at a time
        symbolFilterId: coinId,
        exchangeFilterId: null
      }
    }

    case SET_QUOTE_CURRENCY: {
      return {
        ...state,
        quoteSymbol: getOr(state.quoteSymbol, ['payload'], action)
      }
    }

    default:
      return state
  }
}

// Action creators

export const setAppInitialized = () => ({ type: INIT_APP })

export const updateServiceWorker = () => ({ type: UPDATE_SERVICE_WORKER })

export const resetApp = () => dispatch => {
  clearStorage()
  window.location.reload()
}

export const setExchangeFilter = exchangeId => ({
  type: SET_EXCHANGE_FILTER,
  payload: exchangeId
})

export const setSymbolFilter = symbol => ({
  type: SET_SYMBOL_FILTER,
  payload: symbol
})

export const resetFilters = () => dispatch => {
  dispatch(setSymbolFilter())
  dispatch(setExchangeFilter())
}

export const setQuoteCurrency = currency => {
  const quoteCurrency = QUOTE_SYMBOL_LIST.includes(currency)
    ? currency
    : DEFAULT_QUOTE_SYMBOL
  return {
    type: SET_QUOTE_CURRENCY,
    payload: quoteCurrency
  }
}

// Selectors

export const activeFilterSelector = state =>
  get(['core', 'exchangeFilterId'], state) ||
  get(['core', 'symbolFilterId'], state)

export const appStateSelector = getOr(false, ['core', 'init'])

export const serviceWorkerIsUpdatedSelector = getOr(false, [
  'core',
  'serviceWorkerUpdated'
])

export const quoteSymbolSelector = get(['core', 'quoteSymbol'])

export const activeExchangeFilterIdSelector = get(['core', 'exchangeFilterId'])

export const activeSymbolFilterSelector = get(['core', 'symbolFilterId'])
