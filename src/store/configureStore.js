import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { throttle, pick } from 'lodash'
import thunk from 'redux-thunk'

import core from 'store/modules/core'
import portfolio from 'store/modules/portfolio'
import apiKeys from 'store/modules/apiKeys'
import marketData from 'store/modules/marketData'
import { loadState, saveState } from 'utils/localStorage'

const reducer = combineReducers({ core, portfolio, marketData, apiKeys })

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const emptyState = {
  portfolio: {},
  marketData: {},
  core: {},
  apiKeys: {}
}

export const configureStore = () => {
  // load state from localStorage
  const persistedState = loadState() || emptyState

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
      const { apiKeys, portfolio, core } = store.getState()
      saveState({ apiKeys, portfolio, core: pick(core, ['isAppInitialized']) })
    }, 500)
  )

  return store
}
