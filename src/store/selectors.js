import { getOr, get, pipe, find } from 'lodash/fp'

// core
export const getAppState = getOr(false, ['core', 'isAppInitialized'])
export const getServiceWorker = getOr(false, ['core', 'serviceWorkerUpdated'])

// portfolio

// marketData
export const exchangesDataSelector = getOr({}, ['marketData', 'exchanges'])

export const selectExchangeByName = name =>
  pipe(
    exchangesDataSelector,
    get('data'),
    find(ex => ex.name === name || ex.id === name)
  )
