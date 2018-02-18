// Action constants
const SET_PORTFOLIO_DATA = 'SET_PORTFOLIO_DATA'
const DELETE_PORTFOLIO_DATA = 'DELETE_PORTFOLIO_DATA'

const initialState = {}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_PORTFOLIO_DATA: {
      const { exchangeId, data } = action.payload
      return {
        ...state,
        [exchangeId]: { ...data }
      }
    }
    case DELETE_PORTFOLIO_DATA: {
      const { exchangeId } = action.payload
      const { [exchangeId]: deleted, ...newState } = state
      return newState
    }

    default:
      return state
  }
}

// Action creators and actions
export const setPortfolioData = (exchangeId, data) => {}

export const deletePortfolioData = exchangeId => ({
  type: DELETE_PORTFOLIO_DATA,
  payload: { exchangeId }
})
