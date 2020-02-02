// @ts-ignore
import { get, getOr, find } from "lodash/fp";
import { importExchangeApiServiceInstance } from "utils/asyncImportService";
import { createSelector } from "reselect";

// Action constants
const EXCHANGES_LOADING = "EXCHANGES_LOADING";
const EXCHANGES_FAILURE = "EXCHANGES_FAILURE";
const EXCHANGES_SUCCESS = "EXCHANGES_SUCCESS";

const initialState = {
  lastUpdated: null,
  loading: false,
  error: false,
  data: []
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case EXCHANGES_LOADING: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case EXCHANGES_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        data: [...get(["payload", "exchangesList"], action)],
        lastUpdated: new Date().getTime()
      };
    }
    case EXCHANGES_FAILURE: {
      return {
        ...state,
        loading: false,
        error: get(["payload", "error"], action)
      };
    }

    default:
      return state;
  }
}

// Action creators and actions

export const initExchangesList = () => async dispatch => {
  dispatch({ type: EXCHANGES_LOADING });
  try {
    const { getExchangesList } = await importExchangeApiServiceInstance();
    const exchangesList = getExchangesList();

    dispatch({ type: EXCHANGES_SUCCESS, payload: { exchangesList } });
  } catch (error) {
    dispatch({ type: EXCHANGES_FAILURE, payload: { error } });
    throw error;
  }
};

// Selectors
export const exchangesDataSelector = getOr({}, ["exchanges"]);

export const exchangesListSelector = get(["exchanges", "data"]);

export const exchangeByIdSelector = id =>
  createSelector(exchangesListSelector, find({ id }));
