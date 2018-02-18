import { initExchangesList } from './modules/exchanges'
import { fetchAllPortfolioData } from './modules/portfolio'

/**
 * Initialize all app data
 */
export const fetchInitData = () => async dispatch => {
  await dispatch(initExchangesList())
  await dispatch(fetchAllPortfolioData())
}
