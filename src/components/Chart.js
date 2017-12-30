import React from 'react'
import { Content } from 'bloomer'
import { withParentSize, withScreenSize } from '@vx/responsive'
import { compose, withState, lifecycle } from 'recompose'

import BitcoinPrice from './chart/bitcoinprice'

const renderChart = ({ parentWidth, screenHeight, chartData }) => (
  <Content hasTextAlign='centered'>
    <BitcoinPrice data={chartData} width={parentWidth} height={screenHeight} />
  </Content>
)

export default compose(
  withState('chartData', 'setChartData', {}),
  lifecycle({
    componentDidMount () {
      fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
        .then(res => {
          return res.json()
        })
        .then(json => {
          this.props.setChartData(json)
        })
    }
  }),
  withParentSize,
  withScreenSize
)(renderChart)
