import axios from "axios";
import {
  APP_NAME,
  DEFAULT_QUOTE_SYMBOL,
  TF_1H,
  TF_1D,
  TF_1W,
  TF_1M,
  TF_6M,
  TF_1Y,
  TF_2Y,
} from "appConstants";
// @ts-ignore
import { get, join, flatten, pipe, mapValues, reject } from "lodash/fp";
import { multiply } from "./calcFloat";

const PRICE_DATA_BASE_URL = "https://min-api.cryptocompare.com/data/";
// const PRICE_PATH = 'price'
const CURRENT_PRICE_URL_SUBPATH = "pricemulti";

const URL_PATH_MINUTE = "histominute";
const URL_PATH_HOUR = "histohour";
const URL_PATH_DAY = "histoday";

/**
 * Definition of url properties for each timeframe
 * urlPath: which time period to use
 * limit: how many periods to fetch
 */
export const timeFrames = {
  [TF_1H]: {
    urlPath: URL_PATH_MINUTE,
    limit: 60,
  },
  [TF_1D]: {
    urlPath: URL_PATH_MINUTE,
    limit: 1440,
  },
  [TF_1W]: {
    urlPath: URL_PATH_HOUR,
    limit: 168,
  },
  [TF_1M]: {
    urlPath: URL_PATH_HOUR,
    limit: 744,
  },
  [TF_6M]: {
    urlPath: URL_PATH_DAY,
    limit: 180,
  },
  [TF_1Y]: {
    urlPath: URL_PATH_DAY,
    limit: 360,
  },
  [TF_2Y]: {
    urlPath: URL_PATH_DAY,
    limit: 720,
  },
};

/**
 * Axios instance to make http requests
 */
const priceDataApiInstance = axios.create({
  baseURL: PRICE_DATA_BASE_URL,
});

/**
 * Make api get request to the default api instance
 * @param {string} path
 * @param {Object} params
 */
const makePriceApiCall = async (path, params) =>
  priceDataApiInstance.get(path, {
    // By the request of cryptocompare as a data provider, we include app name in the request
    params: { ...params, extraParam: APP_NAME },
  });

const histoDataResultSelector = get(["data", "Data"]);

const parseHistoDataTimestamp = (value) => ({
  ...value,
  time: multiply(value.time, 1000),
});

/**
 * Parse histo data api result.
 *
 * Example result object: {BTC:[{close:123}, ...]}
 *
 * @param {Object} resData
 * @param {string} baseSymbol
 * @return {object}
 */
const parseHistoDataResult = (resData, baseSymbol) => {
  const data = histoDataResultSelector(resData) || [];

  return {
    [baseSymbol]: data.map(parseHistoDataTimestamp),
  };
};

/**
 * Parse current price api result
 *
 * Example result object: {BTC:2345, XMR: 45656, ...}
 *
 * @param {Object} resData
 * @param {string} quoteSymbol
 */
const parseCurrentPriceResult = (resData, quoteSymbol) =>
  pipe(get("data"), mapValues(get(quoteSymbol)))(resData);

/**
 * Get api instance for histodata fetching by single symbol
 * @param {string} path url subpath
 * @param {Object} params
 */
const getHistoDataApiInstance = (path, params) => async (baseSymbol) => {
  try {
    const res = await makePriceApiCall(path, {
      ...params,
      fsym: baseSymbol,
    });

    return parseHistoDataResult(res, baseSymbol);
  } catch (error) {
    return {};
  }
};

/**
 * Fetch histoData for mutliple symbols
 * @param {Array<string>} baseSymbols
 * @param {function} fetchHistoDataFunc
 */
const fetchMultiHistoData = async (baseSymbols = [], fetchHistoDataFunc) => {
  const promises = baseSymbols.map(fetchHistoDataFunc);
  const data = await Promise.all(promises);
  // merge all results into one object
  const res = data.reduce(
    (acc, currentData) => ({
      ...acc,
      ...currentData,
    }),
    {}
  );
  return res;
};

/**
 * Fetch price histoData
 * @param {Object} histoDataParams
 * @property {string|array<string>} histoDataParams.baseSymbols
 * @property {string} [histoDataParams.quoteSymbol] defaults to USD
 * @property {string} histoDataParams.timeFrame
 * @returns {Promise<Object|Error>}
 *
 * Result object example {
 *  BTC: [
 *  { time: date,
 *    close: number
 *    ...
 *  },
 *  ...
 *  ],
 *  XMR: [
 *    { time: date, ...}
 *  ],
 *  ...
 * }
 */
export const fetchOHLCV = async ({
  baseSymbols,
  quoteSymbol,
  timeframe = TF_1M,
}) => {
  // Turn params into arrays and remove possible duplicities with quoteSymbol
  // (preventing error when fetching bitcoin data while having btc as quote currency)
  baseSymbols = pipe(flatten, reject(quoteSymbol))([baseSymbols]);

  // get url details based on chosen timeframe
  const { urlPath, limit } = timeFrames[timeframe];

  // get api instance which can be then called multiple times with different symbols
  const histoDataApiInstance = getHistoDataApiInstance(urlPath, {
    tsym: quoteSymbol || DEFAULT_QUOTE_SYMBOL,
    limit: limit,
  });

  const res =
    // If there are multiple base symbols, split into multiple requests
    // as current api does not support multiple base symbols in one histoData request
    baseSymbols.length > 1
      ? await fetchMultiHistoData(baseSymbols, histoDataApiInstance)
      : await histoDataApiInstance(baseSymbols[0]);

  return res;
};

/**
 * Fetch current price of selected symbols
 * @param {Object} currentPriceParams
 * @property {string|Array<string>} currentPriceParams.baseSymbols
 * @property {string} currentPriceParams.quoteSymbol
 * @returns {Promise<Object|Error>}
 */
export const fetchCurrentPrice = async ({ baseSymbols, quoteSymbol }) => {
  // Turn params into arrays
  baseSymbols = pipe(flatten, join(","))([baseSymbols]);

  // If there are more than one symbols in each array,
  const path = CURRENT_PRICE_URL_SUBPATH;

  const res = await makePriceApiCall(path, {
    // TODO delete default 'BTC' later
    fsyms: baseSymbols || "BTC",
    tsyms: quoteSymbol,
  });

  return parseCurrentPriceResult(res, quoteSymbol);
};
