// @ts-ignore
import { isEmpty, get } from "lodash/fp";
import { initExchangesList } from "./modules/exchanges";
import {
  fetchAllPortfolioData,
  fetchPortfolioData,
  deletePortfolioData
} from "./modules/portfolio";
import { fetchHistoData, fetchCurrentPriceData } from "./modules/priceData";
import {
  setExchangeCredentials,
  deleteExchangeCredentials
} from "./modules/apiKeys";
import { importToastService } from "utils/asyncImportService";
import { setQuoteCurrency } from "./modules/core";

/**
 * This module exports a set of global action creators which are operating over many modules
 */

/**
 * Initialize all app data
 */
export const fetchInitData = () => async dispatch => {
  await dispatch(initExchangesList());
  await dispatch(fetchAllPortfolioData());
  await dispatch(fetchCurrentPriceData());
  await dispatch(fetchHistoData());
};

const notifyExchangeSuccess = async () => {
  const { toast } = await importToastService();
  toast.success(`Api credentials saved`);
};

/**
 * Save credentials into store and fetch portfolio data
 * Only dispatch this action after testing validity of the credentials
 */
export const saveApiCredentials = creds => async dispatch => {
  if (isEmpty(creds)) {
    return;
  }
  dispatch(setExchangeCredentials(creds));
  notifyExchangeSuccess();
  await dispatch(fetchPortfolioData(get("exchangeId", creds)));
  await dispatch(fetchCurrentPriceData());
  await dispatch(fetchHistoData());
};

/**
 * Change quote currency and refetch price data
 * @param {string} currency
 */
export const changeQuoteCurrency = currency => async dispatch => {
  if (!currency) {
    return;
  }
  dispatch(setQuoteCurrency(currency));
  await dispatch(fetchCurrentPriceData());
  await dispatch(fetchHistoData());
};

const notifyExchangeDeleteSuccess = async () => {
  const { toast } = await importToastService();
  toast.warning(`Exchange successfully remover`);
};

/**
 * Delete Exchange api keys and all its portfolio data from store
 * @param {string} exchangeId
 */
export const deleteApiKeys = exchangeId => async dispatch => {
  if (!exchangeId) {
    return;
  }
  dispatch(deleteExchangeCredentials(exchangeId));
  dispatch(deletePortfolioData(exchangeId));
  await dispatch(fetchCurrentPriceData());
  dispatch(fetchHistoData());
  notifyExchangeDeleteSuccess();
};
