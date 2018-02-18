// @ts-ignore
import {
  getOr,
  get,
  pipe,
  map,
  filter,
  isEmpty,
  reduce,
  isUndefined
} from 'lodash/fp'
import { assignWith } from 'lodash'
import Big from 'big.js'

import { createSelector } from 'reselect'

// core
export const appStateSelector = getOr(false, ['core', 'init'])
export const serviceWorkerIsUpdatedSelector = getOr(false, [
  'core',
  'serviceWorkerUpdated'
])

// portfolio

// exchanges
export const exchangesDataSelector = getOr({}, ['exchanges'])
export const exchangesListSelector = get(['exchanges', 'data'])

// apiKeys
export const apiKeysSelector = get('apiKeys')

export const apiKeysByIdSelector = exchangeId =>
  pipe(apiKeysSelector, get(exchangeId))

export const savedExchangesListSelector = state => {
  const exchanges = exchangesListSelector(state)
  return pipe(
    get('apiKeys'),
    map(({ exchangeId }) => ({ ...exchanges.find(ex => ex.id === exchangeId) }))
  )(state)
}

export const unusedExchangesListSelector = state => {
  const apiKeys = apiKeysSelector(state)
  return pipe(exchangesListSelector, filter(({ id }) => isEmpty(apiKeys[id])))(
    state
  )
}

// portfolio

export const allPortfolioDataSelector = get('portfolio')

export const portfolioDataByIdSelector = exchangeId =>
  pipe(allPortfolioDataSelector, get([exchangeId, 'data']))

const sumValues = (objValue, srcValue) => {
  return isUndefined(objValue)
    ? parseFloat(srcValue)
    : parseFloat(Big(srcValue).plus(objValue))
}

export const totalSumPortfolioSelector = createSelector(
  pipe(allPortfolioDataSelector, map(get('data'))),
  pipe(
    reduce((total, holdings) => {
      return assignWith({}, total, holdings, sumValues)
    }, {})
  )
)
