export const appName = 'hodl.watch'

export const baseCurrency = 'USD'

/**
 * @typedef {('DAY'|'HOUR'|'MINUTE')} TimeFrameName
 */

/**
 * @typedef {Object} TimeFrame
 * @property {string} ccUrlEndpoint
 * @property {string} shortcut
 */

/**
 * @typedef {Object} TimeFrames
 * @property {TimeFrame} DAY
 * @property {TimeFrame} HOUR
 * @property {TimeFrame} MINUTE
 */
export const timeFrames = {
  DAY: {
    ccUrlEndopoint: 'histoday',
    shortcut: 'd'
  },
  HOUR: {
    ccUrlEndopoint: 'histohour',
    shortcut: 'h'
  },
  MINUTE: {
    ccUrlEndopoint: 'histominute',
    shortcut: 'm'
  }
}
