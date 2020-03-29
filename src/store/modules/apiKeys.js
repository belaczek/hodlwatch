// @ts-ignore
import { get, pipe, pick } from "lodash/fp";
import { deletePortfolioData } from "./portfolio";
import { DEFAULT_PROXY_URL } from "appConstants";

// Action constants

const SET_EXCHANGE_CREDENTIALS = "SET_EXCHANGE_CREDENTIALS";
const DELETE_EXCHANGE_CREDENTIALS = "DELETE_EXCHANGE_CREDENTIALS";
const TOGGLE_GLOBAL_PROXY_SETTINGS = "TOGGLE_PROXY_SETTINGS";
const SET_GLOBAL_PROXY_URL = "SET_PROXY_URL";

const initialState = {
  useGlobalApiProxy: false,
  globalProxyUrl: DEFAULT_PROXY_URL,
  data: {},
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXCHANGE_CREDENTIALS: {
      const { exchangeId, ...creds } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [exchangeId]: { exchangeId, ...creds },
        },
      };
    }
    case DELETE_EXCHANGE_CREDENTIALS: {
      const exchangeId = action.payload;
      const { [exchangeId]: deleted, ...newStateData } = state.data;
      return {
        ...state,
        data: newStateData,
      };
    }

    case SET_GLOBAL_PROXY_URL: {
      return {
        ...state,
        globalProxyUrl: action.payload,
      };
    }

    case TOGGLE_GLOBAL_PROXY_SETTINGS: {
      return {
        ...state,
        useGlobalApiProxy: !state.useApiProxy,
      };
    }

    default:
      return state;
  }
}

// Action creators and actions
export const setExchangeCredentials = ({
  exchangeId,
  apiKey,
  secret,
  uid,
  password,
  proxy,
}) => ({
  type: SET_EXCHANGE_CREDENTIALS,
  payload: {
    exchangeId,
    apiKey,
    secret,
    uid,
    password,
    proxy,
  },
});

export const deleteExchangeCredentials = (exchangeId) => (dispatch) => {
  dispatch({
    type: DELETE_EXCHANGE_CREDENTIALS,
    payload: exchangeId,
  });

  dispatch(deletePortfolioData(exchangeId));
};

export const toggleProxySettings = () => ({
  type: TOGGLE_GLOBAL_PROXY_SETTINGS,
});

export const setProxyUrl = (url) => ({
  type: SET_GLOBAL_PROXY_URL,
  payload: url,
});

// Selectors

export const proxySettingsSelector = pipe(
  get(["apiKeys"]),
  pick(["useGlobalApiProxy", "globalProxyUrl"])
);

export const activeProxySelector = (state) => {
  const { useGlobalApiProxy, globalProxyUrl } = proxySettingsSelector(state);
  return useGlobalApiProxy && globalProxyUrl;
};

export const parseProxySettings = (state) => (apiKey) => {
  const globalProxy = activeProxySelector(state);
  return {
    ...apiKey,
    proxy: apiKey.proxy || globalProxy,
  };
};

export const apiKeysSelector = get(["apiKeys", "data"]);

export const apiKeysByIdSelector = (exchangeId) =>
  pipe(apiKeysSelector, get(exchangeId));
