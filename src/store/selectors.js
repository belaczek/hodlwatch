import { get } from 'lodash'

export const exchangesDataSelector = state =>
  get(state, ['marketData', 'exchanges'], {})

export const selectExchangeByName = name => state => {
  const { data } = exchangesDataSelector(state)
  const exchange = data.find(ex => ex.name === name || ex.id === name)
  return exchange
}
