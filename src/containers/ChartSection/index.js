import React from 'react'
import { Container } from 'bloomer'
// @ts-ignore
import { get } from 'lodash/fp'
import { compose, withPropsOnChange } from 'recompose'
import { connect } from 'react-redux'
import {
  histoDataBySymbolSelector,
  currentPriceDataBySymbolSelector,
  changeTimeFrame,
  activeTimeFrameSelector
} from 'store/modules/priceData'
import BitcoinPrice from 'components/chart/bitcoinprice'

import TimeFrames from 'components/TimeFrames'

import './index.css'

const renderChart = ({
  parentWidth,
  screenHeight,
  chartData,
  activeTimeFrame,
  handleTfChange
}) => (
  <Container className="is-widescreen">
    <BitcoinPrice data={chartData} width={parentWidth} height={screenHeight} />
    <TimeFrames
      className="is-centered"
      activeTf={activeTimeFrame}
      onChange={handleTfChange}
    />
  </Container>
)

export default compose(
  connect(
    state => ({
      histoData: histoDataBySymbolSelector('BTC')(state),
      currentPriceData: currentPriceDataBySymbolSelector('BTC')(state),
      currentPriceDataUpdated: get(
        'priceData.currentPriceDataLastUpdated',
        state
      ),
      activeTimeFrame: activeTimeFrameSelector(state)
    }),
    dispatch => ({
      handleTfChange: tf => dispatch(changeTimeFrame(tf))
    })
  ),

  withPropsOnChange(
    ['histoData', 'currentPriceData'],
    ({ histoData, currentPriceData, currentPriceDataUpdated }) => {
      let chartData = []

      if (histoData) {
        chartData = histoData.map(({ time, close }) => ({
          time: new Date(time * 1000),
          price: close
        }))
      }

      if (currentPriceData) {
        chartData.push({
          price: currentPriceData,
          time: new Date(currentPriceDataUpdated)
        })
      }

      return {
        chartData
      }
    }
  )
)(renderChart)
