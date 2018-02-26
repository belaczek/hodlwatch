// @ts-ignore
import { isEmpty, get } from 'lodash/fp'
import { initExchangesList } from './modules/exchanges'
import { fetchAllPortfolioData, fetchPortfolioData } from './modules/portfolio'
import { fetchHistoData, fetchCurrentPriceData } from './modules/priceData'
import { setExchangeCredentials } from './modules/apiKeys'
import { importToastService } from 'utils/asyncImportService'

/**
 * Initialize all app data
 */
export const fetchInitData = () => async dispatch => {
  await dispatch(initExchangesList())
  await dispatch(fetchAllPortfolioData())
  await dispatch(fetchCurrentPriceData())
  await dispatch(fetchHistoData())
}

const notifyExchangeSuccess = async () => {
  const { toast } = await importToastService()
  toast.success(`Api credentials saved`)
}

/**
 * Save credentials into store and fetch portfolio data
 * Only dispatch this action after testing validity of the credentials
 */
export const saveApiCredentials = creds => async dispatch => {
  if (isEmpty(creds)) {
    return
  }
  dispatch(setExchangeCredentials(creds))
  notifyExchangeSuccess()
  await dispatch(fetchPortfolioData(get('exchangeId', creds)))
  await dispatch(fetchCurrentPriceData())
  await dispatch(fetchHistoData())
}
