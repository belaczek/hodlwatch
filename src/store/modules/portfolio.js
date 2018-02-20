import getExchangeApiService from 'utils/exchangeApiService'
// @ts-ignore
import { pipe, omit, map, get, find } from 'lodash/fp'
import {
  apiKeysByIdSelector,
  apiKeysSelector,
  exchangesListSelector
} from '../selectors'
import { toast } from 'react-toastify'

// Action constants
// const SET_PORTFOLIO_DATA = 'SET_PORTFOLIO_DATA'
const DELETE_PORTFOLIO_DATA = 'DELETE_PORTFOLIO_DATA'

const PORTFOLIO_DATA_LOADING = 'PORTFOLIO_DATA_LOADING'
const PORTFOLIO_DATA_FAILURE = 'PORTFOLIO_DATA_FAILURE'
const PORTFOLIO_DATA_SUCCESS = 'PORTFOLIO_DATA_SUCCESS'

const initialState = {}

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
      return {
        ...state,
        [exchangeId]: {
          ...state[exchangeId],
          error: null,
          loading: false,
          data: { ...data }
        }
      }
    }
    case PORTFOLIO_DATA_LOADING: {
      const { exchangeId } = action.payload
      return {
        ...state,
        [exchangeId]: {
          ...state[exchangeId],
          error: null,
          loading: true
        }
      }
    }
    case PORTFOLIO_DATA_FAILURE: {
      const { exchangeId, error } = action.payload
      return {
        ...state,
        [exchangeId]: {
          ...state[exchangeId],
          error: error,
          // TODO remove this line later
          data: {},
          loading: false
        }
      }
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
const castFetchError = (exchangeId, getState) => {
  const state = getState()
  const exchangeName = pipe(
    exchangesListSelector,
    find({ id: exchangeId }),
    get('name')
  )(state)
  toast(`Failed to fetch data from ${exchangeName}`, { type: toast.TYPE.ERROR })
}

/**
 * Fetch portfolio data from target exchange
 * @param {string} exchangeId
 */
export const fetchPortfolioData = exchangeId => async (dispatch, getState) => {
  if (exchangeId) {
    dispatch({ type: PORTFOLIO_DATA_LOADING, payload: { exchangeId } })
    try {
      const { fetchExchangeAccountBalance } = await getExchangeApiService()
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
      castFetchError(exchangeId, getState)
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
