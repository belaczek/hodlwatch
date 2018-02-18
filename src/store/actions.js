import { initExchangesList } from './modules/exchanges'

/**
 * Initialize all app data
 */
export const fetchInitData = () => async dispatch => {
  await dispatch(initExchangesList())
}
