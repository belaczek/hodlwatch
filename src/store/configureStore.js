import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { combineReducers } from "redux";
import portfolio from "./modules/portfolio";
import marketData from "./modules/marketData";
import { loadState, saveState } from "../localStorage";
import throttle from "lodash/throttle";

const reducer = combineReducers({ portfolio, marketData });

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const emptyState = {
  portfolio: {}
};

export const configureStore = () => {
  // load state from localStorage
  const persistedState = loadState() || emptyState;

  const store = createStore(
    reducer,
    persistedState,
    composeEnhancers(applyMiddleware(thunk))
  );

  store.subscribe(
    // save state max once per 500ms to avoid performance issues
    throttle(() => {
      saveState({ portfolio: store.getState().portfolio });
    }, 500)
  );

  return store;
};
