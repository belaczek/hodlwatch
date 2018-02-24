// @ts-ignore
import {
  pipe,
  omit,
  map,
  get,
  find,
  isUndefined,
  omitBy,
  reduce
} from 'lodash/fp'
import { assignWith } from 'lodash'
// import { toast } from 'react-toastify'
import {
  importExchangeApiServiceInstance,
  importToastService
} from 'utils/asyncImportService'
import Big from 'big.js'
import { createSelector } from 'reselect'
import { apiKeysByIdSelector, apiKeysSelector } from 'store/modules/apiKeys'
import { exchangesListSelector } from 'store/modules/exchanges'

// Action constants
// const SET_PORTFOLIO_DATA = 'SET_PORTFOLIO_DATA'
const DELETE_PORTFOLIO_DATA = 'DELETE_PORTFOLIO_DATA'

const PORTFOLIO_DATA_LOADING = 'PORTFOLIO_DATA_LOADING'
const PORTFOLIO_DATA_FAILURE = 'PORTFOLIO_DATA_FAILURE'
const PORTFOLIO_DATA_SUCCESS = 'PORTFOLIO_DATA_SUCCESS'

const initialState = {
  loading: false,
  error: null,
  lastUpdated: null,
  data: {}
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case DELETE_PORTFOLIO_DATA: {
      const { exchangeId } = action.payload
      const { [exchangeId]: deleted, ...newState } = state
      return newState
    }
    case PORTFOLIO_DATA_SUCCESS: {
      const { exchangeId, data } = action.payload

      return exchangeId
        ? {
          ...state,
          [exchangeId]: {
            ...state[exchangeId],
            error: null,
            loading: false,
            lastUpdated: new Date().getTime(),
            data: { ...data }
          }
        }
        : state
    }
    case PORTFOLIO_DATA_LOADING: {
      const { exchangeId } = action.payload
      return exchangeId
        ? {
          ...state,
          [exchangeId]: {
            ...state[exchangeId],
            error: null,
            loading: true
          }
        }
        : state
    }
    case PORTFOLIO_DATA_FAILURE: {
      const { exchangeId, error } = action.payload
      return exchangeId
        ? {
          ...state,
          [exchangeId]: {
            ...state[exchangeId],
            error: error,
            // TODO remove this line later
            data: {},
            loading: false
          }
        }
        : state
    }

    // case SET_PORTFOLIO_DATA: {
    //   const { exchangeId, data } = action.payload
    //   return {
    //     ...state,
    //     [exchangeId]: {
    //       ...state[exchangeId],
    //       data: { ...data }
    //     }
    //   }
    // }

    default:
      return state
  }
}

const getTotalValues = get('total')

// Action creators and actions

export const deletePortfolioData = exchangeId => ({
  type: DELETE_PORTFOLIO_DATA,
  payload: { exchangeId }
})

/**
 * Show notification about failed portfolio fetch
 */
const notifyFetchError = async (exchangeId, getState) => {
  const { toast } = await importToastService()
  const state = getState()
  const exchangeName = pipe(
    exchangesListSelector,
    find({ id: exchangeId }),
    get('name')
  )(state)
  toast.error(`Failed to fetch data from ${exchangeName}`)
}

/**
 * Fetch portfolio data from target exchange
 * @param {string} exchangeId
 */
export const fetchPortfolioData = exchangeId => async (dispatch, getState) => {
  if (exchangeId) {
    dispatch({ type: PORTFOLIO_DATA_LOADING, payload: { exchangeId } })
    try {
      const {
        fetchExchangeAccountBalance
      } = await importExchangeApiServiceInstance()
      const state = getState()
      const apiKeys = pipe(apiKeysByIdSelector(exchangeId), omit('exchangeId'))(
        state
      )
      const data = await fetchExchangeAccountBalance(exchangeId, apiKeys)
      const totalData = getTotalValues(data)

      dispatch({
        type: PORTFOLIO_DATA_SUCCESS,
        payload: { exchangeId, data: totalData }
      })
    } catch (error) {
      console.error(error)
      notifyFetchError(exchangeId, getState)
      dispatch({ type: PORTFOLIO_DATA_FAILURE, payload: { exchangeId, error } })
    }
  }
}

/**
 * Fetch all portfolio data
 */
export const fetchAllPortfolioData = () => async (dispatch, getState) => {
  const state = getState()
  const apiKeys = apiKeysSelector(state)
  const fetchingPromises = map(
    ({ exchangeId }) => dispatch(fetchPortfolioData(exchangeId)),
    apiKeys
  )
  await Promise.all(fetchingPromises)
}

// Selectors

export const allPortfolioDataSelector = get('portfolio')

export const portfolioDataByIdSelector = exchangeId =>
  pipe(allPortfolioDataSelector, get([exchangeId, 'data']), omitBy(val => !val))

const sumValues = (objValue, srcValue) => {
  return isUndefined(objValue)
    ? parseFloat(srcValue)
    : parseFloat(Big(srcValue).plus(objValue))
}

export const totalSumPortfolioSelector = createSelector(
  pipe(allPortfolioDataSelector, map(get('data'))),
  pipe(
    reduce((total, holdings) => {
      return assignWith({}, total, holdings, sumValues)
    }, {}),
    omitBy(val => !val)
  )
)
