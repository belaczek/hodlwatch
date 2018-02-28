// @ts-ignore
import { get, getOr, keys, pipe, thru } from 'lodash/fp'
import { fetchOHLCV, fetchCurrentPrice } from 'utils/priceDataService'
import { importToastService } from 'utils/asyncImportService'
import {
  quoteSymbolSelector,
  activeExchangeFilterIdSelector
} from 'store/modules/core'
import { portfolioSymbolsSelector } from 'store/modules/portfolio'
import { TF_1M, TIME_FRAMES } from 'appConstants'

const PRICE_DATA_MODULE = 'priceData'

// Action constants
const HISTO_PRICE_DATA_LOADING = 'HISTO_PRICE_DATA_LOADING'
const HISTO_PRICE_DATA_FAILURE = 'HISTO_PRICE_DATA_FAILURE'
const HISTO_PRICE_DATA_SUCCESS = 'HISTO_PRICE_DATA_SUCCESS'
const PRICE_DATA_SET_TIMEFRAME = 'PRICE_DATA_SET_TIMEFRAME'

const CURRENT_PRICE_DATA_LOADING = 'CURRENT_PRICE_DATA_LOADING'
const CURRENT_PRICE_DATA_FAILURE = 'CURRENT_PRICE_DATA_FAILURE'
const CURRENT_PRICE_DATA_SUCCESS = 'CURRENT_PRICE_DATA_SUCCESS'

const initialState = {
  histoDataLoading: false,
  histoDataError: false,
  histoDataLastUpdated: null,
  histoData: {},
  timeframe: TF_1M,

  currentPriceDataLoading: false,
  currentPriceDataError: false,
  currentPriceDataLastUpdated: null,
  currentPriceData: {},
  currentPriceDatalastUpdated: null
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case HISTO_PRICE_DATA_LOADING: {
      return {
        ...state,
        histoDataLoading: true,
        histoDataError: false
      }
    }
    case HISTO_PRICE_DATA_SUCCESS: {
      return {
        ...state,
        histoDataLoading: false,
        histoDataError: null,
        histoData: getOr(state.histoData, ['payload'], action),
        histoDataLastUpdated: new Date().getTime()
      }
    }
    case HISTO_PRICE_DATA_FAILURE: {
      return {
        ...state,
        histoDataLoading: false,
        histoDataError: get(['payload'], action)
      }
    }

    case PRICE_DATA_SET_TIMEFRAME: {
      const tf = get(['payload'], action)
      return {
        ...state,
        // if target timeframe does not exist, keep existing
        timeframe: TIME_FRAMES[tf] ? tf : state.timeframe
      }
    }

    case CURRENT_PRICE_DATA_LOADING: {
      return {
        ...state,
        currentPriceDataLoading: true,
        currentPriceDataError: false
      }
    }
    case CURRENT_PRICE_DATA_SUCCESS: {
      return {
        ...state,
        currentPriceDataLoading: false,
        currentPriceDataError: null,
        currentPriceData: getOr(state.currentPriceData, ['payload'], action),
        currentPriceDataLastUpdated: new Date().getTime()
      }
    }
    case CURRENT_PRICE_DATA_FAILURE: {
      return {
        ...state,
        currentPriceDataLoading: false,
        currentPriceDataError: get(['payload'], action)
      }
    }

    default:
      return state
  }
}

// Action creators and actions

/**
 * Show error notification
 * @param {string} message
 */
const notifyError = async message => {
  const { toast } = await importToastService()
  toast.error(message)
}

/**
 * Fetch all histo data of all holdings for target timeframe
 */
export const fetchHistoData = () => async (dispatch, getState) => {
  dispatch({ type: HISTO_PRICE_DATA_LOADING })

  const state = getState()

  const params = {
    timeframe: get(['priceData', 'timeframe'], state),
    quoteSymbol: quoteSymbolSelector(state)
  }

  try {
    let data = await pipe(
      activeExchangeFilterIdSelector,
      // TODO reconsider whether or not should historical data be filtered for fetchind
      thru(exchangeId => portfolioSymbolsSelector()(state)),
      keys,
      thru(baseSymbols => fetchOHLCV({ ...params, baseSymbols }))
    )(state)

    dispatch({ type: HISTO_PRICE_DATA_SUCCESS, payload: data })
  } catch (error) {
    notifyError('Failed to fetch chart data. Check console for more details')
    console.log('histo data fetch error: ', error)
    dispatch({ type: HISTO_PRICE_DATA_FAILURE, payload: error })
  }
}

/**
 * Fetch all current price data of all current holdings
 */
export const fetchCurrentPriceData = () => async (dispatch, getState) => {
  dispatch({ type: CURRENT_PRICE_DATA_LOADING })

  const state = getState()
  const quoteSymbol = quoteSymbolSelector(state)

  try {
    const data = await pipe(
      portfolioSymbolsSelector(),
      keys,
      thru(baseSymbols => fetchCurrentPrice({ quoteSymbol, baseSymbols }))
    )(state)

    dispatch({ type: CURRENT_PRICE_DATA_SUCCESS, payload: data })
  } catch (error) {
    notifyError(
      'Failed to fetch current price data. Check console for more details'
    )
    console.log('current price fetch error: ', error)
    dispatch({ type: CURRENT_PRICE_DATA_FAILURE, payload: error })
  }
}

/**
 * Change timeframe and refetch all current and historical price data
 * @param {string} timeframe
 */
export const changeTimeFrame = timeframe => async (dispatch, getState) => {
  dispatch({
    type: PRICE_DATA_SET_TIMEFRAME,
    payload: timeframe
  })
  dispatch(fetchCurrentPriceData())
  dispatch(fetchHistoData())
}

// Selectors

/**
 * Get all histoData
 */
export const histoDataStateSelector = get([PRICE_DATA_MODULE, 'histoData'])

/**
 * Get all current price data
 */
export const currentPriceDataStateSelector = get([
  PRICE_DATA_MODULE,
  'currentPriceData'
])

/**
 * Get selected timeframe
 */
export const activeTimeFrameSelector = get([PRICE_DATA_MODULE, 'timeframe'])
