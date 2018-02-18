// @ts-ignore
import { get } from 'lodash/fp'

// Action constants
const HISTO_DATA_LOADING = 'HISTO_DATA_LOADING'
const HISTO_DATA_FAILURE = 'HISTO_DATA_FAILURE'
const HISTO_DATA_SUCCESS = 'HISTO_DATA_SUCCESS'

const initialState = {
  loading: false,
  error: false,
  data: {},
  lastUpdated: null
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case HISTO_DATA_LOADING: {
      return {
        ...state,
        loading: true,
        error: false
      }
    }
    case HISTO_DATA_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        data: get(['payload', 'exchangesList'], action),
        lastUpdated: new Date()
      }
    }
    case HISTO_DATA_FAILURE: {
      console.log(action.payload.error)
      return {
        ...state,
        loading: false,
        error: get(['payload', 'error'], action),
        lastUpdated: new Date()
      }
    }

    default:
      return state
  }
}

// Action creators and actions

// TODO
export const fetchHistoData = () => (dispatch, state) => {
  dispatch({ type: HISTO_DATA_LOADING })
}
