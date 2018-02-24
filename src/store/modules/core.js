// @ts-ignore
import { getOr, get } from 'lodash/fp'
import { clearStorage } from 'utils/localStorage'
import { DEFAULT_QUOTE_CURRENCY } from 'appConstants'

// Action constants
const INIT_APP = 'INIT_APP'
const UPDATE_SERVICE_WORKER = 'UPDATE_SERVICE_WORKER'
const SET_EXCHANGE_FILTER = 'SET_EXCHANGE_FILTER'
const SET_COIN_FILTER = 'SET_COIN_FILTER'
const SET_QUOTE_CURRENCY = 'SET_QUOTE_CURRENCY'

const initialState = {
  init: false,
  serviceWorkerUpdated: false,
  exchangeFilterId: null,
  coinFilterId: null,
  quoteSymbol: DEFAULT_QUOTE_CURRENCY
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
      const exchangeId = getOr(null, ['payload'], action)
      return {
        ...state,
        // Right now only one type of filter is allowed at a time
        exchangeFilterId: exchangeId,
        coinFilterId: null
      }
    }
    case SET_COIN_FILTER: {
      const coinId = getOr(null, ['payload'], action)
      return {
        ...state,
        // Right now only one type of filter is allowed at a time
        coinFilterId: coinId,
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

export const setCoinFilter = coinId => ({
  type: SET_EXCHANGE_FILTER,
  payload: coinId
})

export const resetFilters = () => dispatch => {
  dispatch(setCoinFilter())
  dispatch(setExchangeFilter())
}

// Selectors

export const activeFilterSelector = state =>
  get(['core', 'exchangeFilterId'], state) ||
  get(['core', 'coinFilterId'], state)

export const appStateSelector = getOr(false, ['core', 'init'])

export const serviceWorkerIsUpdatedSelector = getOr(false, [
  'core',
  'serviceWorkerUpdated'
])

export const quoteSymbolSelector = get(['core', 'quoteSymbol'])

export const exchangeFilterIdSelector = get(['core', 'exchangeFilterId'])

export const activeCoinFilterSelector = get(['core', 'coinFilterId'])
