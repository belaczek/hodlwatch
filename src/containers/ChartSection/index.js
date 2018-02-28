import React from 'react'
import { Container } from 'bloomer'
// @ts-ignore
import { get, first, keys, pipe, omit, map } from 'lodash/fp'
import { compose, withPropsOnChange } from 'recompose'
import { connect } from 'react-redux'
import format from 'date-fns/format'
import { changeTimeFrame } from 'store/modules/priceData'

import TimeFrames from 'components/TimeFrames'

import './index.css'
import { chartDataMarketValueSelector } from 'store/selectors'
import Chart from 'components/Chart/'
import { quoteSymbolSelector } from 'store/modules/core'
import { stringToColour } from 'utils/stringToColor'
import { TIME_FRAMES } from 'appConstants'

const renderChart = ({
  parentWidth,
  screenHeight,
  chartData,
  activeTimeFrame,
  handleTfChange,
  baseSymbols,
  quoteSymbol
}) => (
  <Container className="is-widescreen">
    <Chart
      chartData={chartData}
      baseSymbols={baseSymbols}
      quoteSymbol={quoteSymbol}
    />
    <TimeFrames
      className="is-centered"
      activeTf={activeTimeFrame}
      onChange={handleTfChange}
    />
  </Container>
)

export default compose(
  connect(
    (state, { exchangeFilter: exchangeId, symbolFilter: symbol }) => ({
      currentPriceDataUpdated: get(
        'priceData.currentPriceDataLastUpdated',
        state
      ),
      chartData: chartDataMarketValueSelector({
        exchangeId,
        symbol
      })(state),
      quoteSymbol: quoteSymbolSelector(state)
    }),
    dispatch => ({
      handleTfChange: tf => dispatch(changeTimeFrame(tf))
    })
  ),

  withPropsOnChange(
    ['chartData', 'activeTimeFrame'],
    ({ activeTimeFrame, chartData = [] }) => {
      // parse all symbol names and generate unique color for each
      const baseSymbols = pipe(
        first,
        omit('time'),
        keys,
        map(name => ({
          name,
          colour: stringToColour(name)
        }))
      )(chartData)

      const dateFormat = TIME_FRAMES[activeTimeFrame].chartDateFormat

      // Parse timestamp into radable format
      const chartDataWithTime = chartData.map(value => {
        return {
          ...value,
          time: format(new Date(value.time), dateFormat)
        }
      })

      return {
        baseSymbols,
        chartData: chartDataWithTime
      }
    }
  )
)(renderChart)
