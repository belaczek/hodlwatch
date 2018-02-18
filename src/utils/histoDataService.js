import axios from 'axios'
import { baseCurrency, timeFrames } from 'appConstants'
// @ts-ignore
import { get } from 'lodash/fp'

const histoDataUrl = 'https://min-api.cryptocompare.com/data/'

const histoDataApiInstance = axios.create({
  baseURL: histoDataUrl
})

/**
 * @typedef {Object} HistoDataParamsSchema
 * @property {string} baseSymbol
 * @property {string} [quoteSymbol] defaults to USD
 * @property {TimeFrameName} timeFrame
 * @property {string} [exchange]
 * @property {string} [limit]
 */

/**
 * Fetch price histoData
 * @param {HistoDataParamsSchema}
 * @returns {Promise<Object|Error>}
 */
export const fetchOHLCV = async ({
  baseSymbol,
  quoteSymbol,
  timeframe,
  exchange,
  limit
}) => {
  const timeframeUrl = timeFrames[timeframe].ccUrlEndopoint
  try {
    const res = await histoDataApiInstance.get(timeframeUrl, {
      params: {
        fsym: baseSymbol,
        tsym: quoteSymbol || baseCurrency,
        limit: limit || undefined,
        e: exchange || undefined
      }
    })

    return await get(['data', 'Data'], res)
  } catch (e) {
    console.log(e)
    throw e
  }
}

export default {
  fetchOHLCV
}
