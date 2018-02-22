import React from 'react'
import { Content } from 'bloomer'
// @ts-ignore
import { withParentSize, withScreenSize } from '@vx/responsive'
import { compose, withState, lifecycle } from 'recompose'
import format from 'date-fns/format'

import BitcoinPrice from './chart/bitcoinprice'
import { importPriceDataApiService } from 'utils/asyncImportService'

const renderChart = ({ parentWidth, screenHeight, chartData }) => (
  <Content hasTextAlign="centered">
    <BitcoinPrice data={chartData} width={parentWidth} height={screenHeight} />
  </Content>
)

export default compose(
  withState('chartData', 'setChartData', {}),
  lifecycle({
    async componentDidMount () {
      const { fetchOHLCV } = await importPriceDataApiService()
      fetchOHLCV({ baseSymbol: 'BTC', timeframe: 'DAY', limit: 150 }).then(
        data => {
          const strippedData = data.map(({ time, close }) => ({
            time: format(new Date(time * 1000), 'YYYY-MM-DD'),
            price: close
          }))
          this.props.setChartData(strippedData)
        }
      )
    }
  }),
  withParentSize,
  withScreenSize
)(renderChart)
