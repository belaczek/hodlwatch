import reducer, {
  histoDataStateSelector,
  currentPriceDataStateSelector,
  activeTimeFrameSelector
} from '../modules/priceData'
import { TF_1M, TF_1D } from 'appConstants'

const initialState = {
  histoDataLoading: false,
  histoDataError: false,
  histoDataLastUpdated: null,
  histoData: {},
  timeframe: TF_1M,

  currentPriceDataLoading: false,
  currentPriceDataError: false,
  currentPriceDataLastUpdated: null,
  currentPriceData: {}
}

test('reducer should return initial state', () => {
  const state = reducer(undefined, {})
  expect(state).toEqual(initialState)
})

describe('priceData actions', () => {
  const HISTO_PRICE_DATA_LOADING = 'HISTO_PRICE_DATA_LOADING'
  const HISTO_PRICE_DATA_FAILURE = 'HISTO_PRICE_DATA_FAILURE'
  const HISTO_PRICE_DATA_SUCCESS = 'HISTO_PRICE_DATA_SUCCESS'
  const PRICE_DATA_SET_TIMEFRAME = 'PRICE_DATA_SET_TIMEFRAME'

  const CURRENT_PRICE_DATA_LOADING = 'CURRENT_PRICE_DATA_LOADING'
  const CURRENT_PRICE_DATA_FAILURE = 'CURRENT_PRICE_DATA_FAILURE'
  const CURRENT_PRICE_DATA_SUCCESS = 'CURRENT_PRICE_DATA_SUCCESS'

  test('should set histoData loading', () => {
    const state = reducer(initialState, {
      type: HISTO_PRICE_DATA_LOADING
    })

    expect(state).toHaveProperty('histoDataLoading', true)
    expect(state).toHaveProperty('histoDataError', false)
  })

  test('should set histoData failure', () => {
    let state = reducer(initialState, {
      type: HISTO_PRICE_DATA_LOADING
    })

    state = reducer(state, {
      type: HISTO_PRICE_DATA_FAILURE,
      payload: 'errortest'
    })

    expect(state).toHaveProperty('histoDataLoading', false)
    expect(state).toHaveProperty('histoDataError', 'errortest')
  })

  test('should set histoData success', () => {
    const testData = {
      BTC: [
        {
          time: 1,
          close: 100,
          high: 110,
          low: 90,
          open: 99,
          volumeFrom: 100,
          volumeTo: 200
        },
        {
          time: 2,
          close: 200,
          high: 250,
          low: 90,
          open: 100,
          volumeFrom: 200,
          volumeTo: 300
        }
      ],
      LTC: [
        {
          time: 1,
          close: 100,
          high: 110,
          low: 90,
          open: 99,
          volumeFrom: 100,
          volumeTo: 200
        },
        {
          time: 2,
          close: 200,
          high: 250,
          low: 90,
          open: 100,
          volumeFrom: 200,
          volumeTo: 300
        }
      ]
    }

    let state = reducer(initialState, {
      type: HISTO_PRICE_DATA_LOADING
    })

    state = reducer(state, {
      type: HISTO_PRICE_DATA_SUCCESS,
      payload: testData
    })

    expect(state).toHaveProperty('histoDataLoading', false)
    expect(state).toHaveProperty('histoData', testData)
  })

  test('should set timeframe', () => {
    const state = reducer(initialState, {
      type: PRICE_DATA_SET_TIMEFRAME,
      payload: TF_1D
    })

    expect(state).toHaveProperty('timeframe', TF_1D)
  })

  test('should not set invalid timeframe', () => {
    const state = reducer(initialState, {
      type: PRICE_DATA_SET_TIMEFRAME,
      payload: 'bla'
    })

    expect(state).toHaveProperty('timeframe', initialState.timeframe)
  })

  test('should set currentPriceData loading', () => {
    const state = reducer(initialState, {
      type: CURRENT_PRICE_DATA_LOADING
    })

    expect(state).toHaveProperty('currentPriceDataLoading', true)
    expect(state).toHaveProperty('currentPriceDataError', false)
  })

  test('should set currentPriceData failure', () => {
    let state = reducer(initialState, {
      type: CURRENT_PRICE_DATA_LOADING
    })

    state = reducer(state, {
      type: CURRENT_PRICE_DATA_FAILURE,
      payload: 'errortest'
    })

    expect(state).toHaveProperty('currentPriceDataLoading', false)
    expect(state).toHaveProperty('currentPriceDataError', 'errortest')
  })

  test('should set currentPriceData success', () => {
    const testData = {
      BTC: 100,
      LTC: 50
    }

    let state = reducer(initialState, {
      type: CURRENT_PRICE_DATA_LOADING
    })

    state = reducer(state, {
      type: CURRENT_PRICE_DATA_SUCCESS,
      payload: testData
    })

    expect(state).toHaveProperty('currentPriceDataLoading', false)
    expect(state).toHaveProperty('currentPriceData', testData)
  })

  test('should keep currentPriceData when no data', () => {
    const testData = {
      BTC: 100,
      LTC: 50
    }

    let state = reducer(initialState, {
      type: CURRENT_PRICE_DATA_LOADING
    })

    state = reducer(state, {
      type: CURRENT_PRICE_DATA_SUCCESS,
      payload: testData
    })

    state = reducer(state, {
      type: CURRENT_PRICE_DATA_SUCCESS
    })

    expect(state).toHaveProperty('currentPriceDataLoading', false)
    expect(state).toHaveProperty('currentPriceData', testData)
  })
})

describe('priceData selectors', () => {
  const testState = {
    priceData: {
      histoDataLoading: false,
      histoDataError: false,
      histoDataLastUpdated: null,
      histoData: {
        BTC: [
          {
            time: 1,
            close: 100,
            high: 110,
            low: 90,
            open: 99,
            volumeFrom: 100,
            volumeTo: 200
          },
          {
            time: 2,
            close: 200,
            high: 250,
            low: 90,
            open: 100,
            volumeFrom: 200,
            volumeTo: 300
          }
        ],
        LTC: [
          {
            time: 1,
            high: 110,
            low: 90,
            close: 100,
            open: 99,
            volumeFrom: 100,
            volumeTo: 200
          },
          {
            time: 2,
            close: 200,
            high: 250,
            low: 90,
            open: 100,
            volumeFrom: 200,
            volumeTo: 300
          }
        ]
      },
      timeframe: TF_1M,

      currentPriceDataLoading: false,
      currentPriceDataError: false,
      currentPriceDataLastUpdated: null,
      currentPriceData: {
        BTC: 100,
        LTC: 50
      }
    }
  }

  test('should select histoData', () => {
    const res = histoDataStateSelector(testState)
    expect(res).toEqual(testState.priceData.histoData)
  })

  test('should select currentPriceData', () => {
    const res = currentPriceDataStateSelector(testState)
    expect(res).toEqual(testState.priceData.currentPriceData)
  })

  test('should select active timeframe', () => {
    const res = activeTimeFrameSelector(testState)
    expect(res).toEqual(testState.priceData.timeframe)
  })
})
