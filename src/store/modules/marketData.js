import { ccxt } from '../../datasources'
import { get } from 'lodash/fp'

// Action constants
const FETCH_EXCHANGES_LOADING = 'FETCH_EXCHANGES_LOADING'
const FETCH_EXCHANGES_RECEIVED = 'FETCH_EXCHANGES_RECEIVED'
const FETCH_EXCHANGES_FAILED = 'FETCH_EXCHANGES_FAILED'

const initialState = {
  exchanges: {}
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case FETCH_EXCHANGES_LOADING: {
      return {
        ...state,
        exchanges: { ...state.exchanges, loading: true, error: false }
      }
    }
    case FETCH_EXCHANGES_RECEIVED: {
      return {
        ...state,
        exchanges: {
          data: get(['payload', 'exchanges'], action),
          loading: false,
          error: false
        }
      }
    }
    case FETCH_EXCHANGES_FAILED: {
      console.log(action.payload.error)
      return {
        ...state,
        exchanges: {
          ...state.exchanges,
          loading: false,
          error: get(['payload', 'error'], action)
        }
      }
    }
    default:
      return state
  }
}

// Action creators and actions

/**
 * Fetch list of exchanges from ccxt
 * The list is filtered by support of historical data fetching (hasFetchOHLCV)
 */
export const fetchCcxtExchanges = () => async dispatch => {
  dispatch({ type: FETCH_EXCHANGES_LOADING })

  try {
    const ccxtModule = await ccxt()

    /** Instantiate all exchanges and filter to only include those which are fully compatible with our usecase:
     *  - receives cross-origin requests
     *  - supports private api to fetch balance info
     */
    const exchanges = ccxtModule.exchanges
      .map(ex => new ccxtModule[ex]())
      .filter(ex => ex.has.CORS && ex.has.privateAPI && ex.has.fetchBalance)

    dispatch({ type: FETCH_EXCHANGES_RECEIVED, payload: { exchanges } })
  } catch (error) {
    dispatch({ type: FETCH_EXCHANGES_FAILED, payload: { error } })
  }
}
