import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { throttle, pick } from 'lodash'
import thunk from 'redux-thunk'
import core from 'store/modules/core'
import portfolio from 'store/modules/portfolio'
import apiKeys from 'store/modules/apiKeys'
import exchanges from 'store/modules/exchanges'
import priceData from 'store/modules/priceData'
import modals from 'store/modules/modals'
import { loadState, saveState } from 'utils/localStorage'

const reducer = combineReducers({
  core,
  portfolio,
  exchanges,
  apiKeys,
  priceData,
  modals
})

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const configureStore = () => {
  // load state from localStorage
  const persistedState = loadState() || {}

  const store = createStore(
    reducer,
    persistedState,
    composeEnhancers(applyMiddleware(thunk))
  )

  /**
   * Preserve all state changes in local storage
   */
  store.subscribe(
    // save only max once per 500ms to avoid performance issues
    throttle(() => {
      const { portfolio, core, apiKeys, priceData } = store.getState()
      saveState({
        portfolio,
        core: pick(core, ['init', 'quoteSymbol']),
        priceData: pick(priceData, ['timeframe']),
        apiKeys
      })
    }, 500)
  )

  return store
}
