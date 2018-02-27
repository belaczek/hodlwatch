// @ts-ignore
import { getOr, get } from 'lodash/fp'
import { clearStorage } from 'utils/localStorage'
import {
  DEFAULT_QUOTE_SYMBOL,
  QUOTE_SYMBOL_LIST
  // DEFAULT_PROXY_URL
} from 'appConstants'

// Action constants
const INIT_APP = 'INIT_APP'
const UPDATE_SERVICE_WORKER = 'UPDATE_SERVICE_WORKER'
const SET_EXCHANGE_FILTER = 'SET_EXCHANGE_FILTER'
const SET_SYMBOL_FILTER = 'SET_SYMBOL_FILTER'
const SET_QUOTE_CURRENCY = 'SET_QUOTE_CURRENCY'
// const TOGGLE_PROXY_SETTINGS = 'TOGGLE_PROXY_SETTINGS'
// const SET_PROXY_URL = 'SET_PROXY_URL'

const initialState = {
  init: false,
  serviceWorkerUpdated: false,
  exchangeFilterId: null,
  symbolFilterId: null,
  quoteSymbol: DEFAULT_QUOTE_SYMBOL
  // useApiProxy: false,
  // proxyUrl: DEFAULT_PROXY_URL
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

    // case SET_PROXY_URL: {
    //   return {
    //     ...state,
    //     proxyUrl: action.payload
    //   }
    // }

    // case TOGGLE_PROXY_SETTINGS: {
    //   return {
    //     ...state,
    //     useApiProxy: !state.useApiProxy
    //   }
    // }

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

// export const toggleProxySettings = () => ({
//   type: TOGGLE_PROXY_SETTINGS
// })

// export const setProxyUrl = url => ({
//   type: SET_PROXY_URL,
//   payload: url
// })

// Selectors

export const activeFilterSelector = state =>
  get(['core', 'exchangeFilterId'], state) ||
  get(['core', 'symbolFilterId'], state)

export const appStateSelector = getOr(false, ['core', 'init'])

export const serviceWorkerIsUpdatedSelector = getOr(false, [
  'core',
  'serviceWorkerUpdated'
])

// export const proxySettingsSelector = pipe(
//   get(['core']),
//   pick(['useApiProxy', 'proxyUrl'])
// )

// export const activeProxySelector = state => {
//   const { useApiProxy, proxyUrl } = proxySettingsSelector(state)
//   return useApiProxy && proxyUrl
// }

export const quoteSymbolSelector = get(['core', 'quoteSymbol'])

export const activeExchangeFilterIdSelector = get(['core', 'exchangeFilterId'])

export const activeSymbolFilterSelector = get(['core', 'symbolFilterId'])
