// @ts-ignore
import { getOr, get, pipe, map, filter, isEmpty } from 'lodash/fp'

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

// export const exchangesDataSelector = getOr({}, ['marketData', 'exchanges'])

// export const getExchangesInstancesListSelector = pipe(
//   exchangesDataSelector,
//   get('data')
// )

// export const getExchangeByNameSelector = memoize(name =>
//   pipe(exchangesDataSelector, get('data'), find({ name }))
// )

// export const getExchangeByIdSelector = memoize(id =>
//   pipe(exchangesDataSelector, get('data'), find({ id }))
// )

// const defaultApiCredentials = {
//   apiKey: true,
//   secret: true,
//   uid: false,
//   password: false
// }

// export const getRequiredApiCredentialsSelector = memoize(
//   exchangeId => state => {
//     const ex = getExchangeByIdSelector(exchangeId)(state)
//     return getOr(defaultApiCredentials, 'requiredCredentials', ex)
//   }
// )

// export const getExchangesWithApiKeysSelector = createSelector(
//   getApiKeysSelector,
//   getExchangesInstancesListSelector,
//   (keys, exchanges) => {
//     const objectKeys = Object.keys(keys)
//     return exchanges.filter(
//       ex => objectKeys.includes(ex.name) || objectKeys.includes(ex.id)
//     )
//   }
// )
// createSelector(
//   state => getExchangeByNameSelector(name),
//   get('requiredCredentials')
// )
