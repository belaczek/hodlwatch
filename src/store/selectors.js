// @ts-ignore
import { pipe, map, filter, isEmpty } from 'lodash/fp'

import { createSelector } from 'reselect'
import {
  exchangesListSelector,
  exchangeByIdSelector
} from './modules/exchanges'
import { apiKeysSelector } from './modules/apiKeys'
import { exchangeFilterIdSelector } from './modules/core'

/**
 * Store selectors which reach for data into multiple modules
 */

export const savedExchangesListSelector = state => {
  const exchanges = exchangesListSelector(state)
  return pipe(
    apiKeysSelector,
    map(({ exchangeId }) => ({ ...exchanges.find(ex => ex.id === exchangeId) }))
  )(state)
}

export const unusedExchangesListSelector = state => {
  const apiKeys = apiKeysSelector(state)
  return pipe(exchangesListSelector, filter(({ id }) => isEmpty(apiKeys[id])))(
    state
  )
}

export const activeExchangeFilterSelector = createSelector(
  exchangeFilterIdSelector,
  exchangeByIdSelector
)
