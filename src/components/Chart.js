import React from 'react'
import { Content } from 'bloomer'
import { withParentSize, withScreenSize } from '@vx/responsive'
import { compose, withState, lifecycle } from 'recompose'
import format from 'date-fns/format'

import BitcoinPrice from './chart/bitcoinprice'
import { fetchOHLCV } from 'utils/histoDataService'

const renderChart = ({ parentWidth, screenHeight, chartData }) => (
  <Content hasTextAlign='centered'>
    <BitcoinPrice data={chartData} width={parentWidth} height={screenHeight} />
  </Content>
)

export default compose(
  withState('chartData', 'setChartData', {}),
  lifecycle({
    componentDidMount () {
      fetchOHLCV({ baseSymbol: 'BTC', timeframe: 'DAY' }).then(data => {
        const strippedData = data.map(({ time, close }) => ({
          time: format(new Date(time * 1000), 'YYYY-MM-DD'),
          price: close
        }))
        this.props.setChartData(strippedData)
      })
    }
  }),
  withParentSize,
  withScreenSize
)(renderChart)
