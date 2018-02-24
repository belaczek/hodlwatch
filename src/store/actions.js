import { initExchangesList } from './modules/exchanges'
import { fetchAllPortfolioData } from './modules/portfolio'
import { fetchHistoData, fetchCurrentPriceData } from './modules/priceData'

/**
 * Initialize all app data
 */
export const fetchInitData = () => async dispatch => {
  await dispatch(initExchangesList())
  await dispatch(fetchAllPortfolioData())
  await dispatch(fetchCurrentPriceData())
  await dispatch(fetchHistoData())
}
