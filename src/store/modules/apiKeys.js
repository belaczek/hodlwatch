// Action constants

const SET_EXCHANGE_DATA = 'SET_EXCHANGE_DATA'
const DELETE_EXCHANGE_DATA = 'DELETE_EXCHANGE_DATA'

const initialState = {}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_EXCHANGE_DATA: {
      const { exchange, apiKey, secret } = action.payload
      return {
        ...state,
        [exchange]: { name: exchange, apiKey, secret }
      }
    }
    case DELETE_EXCHANGE_DATA: {
      const { exchange } = action.payload
      const { [exchange]: deleted, ...newState } = state
      return newState
    }

    default:
      return state
  }
}

// Action creators and actions
export const setExchangeData = ({ exchange, apiKey, secret }) => ({
  name: SET_EXCHANGE_DATA,
  payload: {
    exchange,
    apiKey,
    secret
  }
})

export const deleteExchangeData = ({ exchange }) => ({
  name: SET_EXCHANGE_DATA,
  payload: {
    exchange
  }
})
