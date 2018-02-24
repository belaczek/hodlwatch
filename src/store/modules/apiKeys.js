// @ts-ignore
import { get, pipe } from 'lodash/fp'
import { deletePortfolioData } from './portfolio'

// Action constants

const SET_EXCHANGE_CREDENTIALS = 'SET_EXCHANGE_CREDENTIALS'
const DELETE_EXCHANGE_CREDENTIALS = 'DELETE_EXCHANGE_CREDENTIALS'

const initialState = {}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_EXCHANGE_CREDENTIALS: {
      const { exchangeId, apiKey, secret, uid, password } = action.payload
      return {
        ...state,
        [exchangeId]: { exchangeId, apiKey, secret, uid, password }
      }
    }
    case DELETE_EXCHANGE_CREDENTIALS: {
      const exchangeId = action.payload
      const { [exchangeId]: deleted, ...newState } = state
      return newState
    }

    default:
      return state
  }
}

// Action creators and actions
export const setExchangeCredentials = ({
  exchangeId,
  apiKey,
  secret,
  uid,
  password
}) => ({
  type: SET_EXCHANGE_CREDENTIALS,
  payload: {
    exchangeId,
    apiKey,
    secret,
    uid,
    password
  }
})

export const deleteExchangeCredentials = ({ exchangeId }) => dispatch => {
  dispatch({
    type: DELETE_EXCHANGE_CREDENTIALS,
    payload: exchangeId
  })

  dispatch(deletePortfolioData(exchangeId))
}

// Selectors

export const apiKeysSelector = get('apiKeys')

export const apiKeysByIdSelector = exchangeId =>
  pipe(apiKeysSelector, get(exchangeId))
