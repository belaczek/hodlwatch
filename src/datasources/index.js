import axios from 'axios'
import { baseCurrency, histoDataUrl } from 'appConstants'
import { get } from 'lodash'

/**
 * Asynchronously load ccxt module to reduce initial page load
 */
export const ccxt = async () => {
  const datasource = await import('ccxt')
  return datasource
}

const timeFrames = {
  DAY: {
    ccEndopoint: 'histoday',
    shortcut: 'd'
  },
  HOUR: {
    ccEndopoint: 'histohour',
    shortcut: 'h'
  },
  MINUTE: {
    ccEndopoint: 'histominute',
    shortcut: 'm'
  }
}

const histoDataApiInstance = axios.create({
  baseURL: histoDataUrl
})

export const fetchOHLCV = async ({
  baseSymbol,
  quoteSymbol,
  timeframe,
  exchange,
  limit
}) => {
  const timeframeUrl = timeFrames[timeframe].ccEndopoint
  try {
    const res = await histoDataApiInstance.get(timeframeUrl, {
      params: {
        fsym: baseSymbol,
        tsym: quoteSymbol || baseCurrency,
        limit: limit || undefined,
        e: exchange || undefined
      }
    })

    return get(res, ['data', 'Data'])
  } catch (e) {
    console.log(e)
    return e
  }
}

export default {
  ccxt,
  fetchOHLCV
}
