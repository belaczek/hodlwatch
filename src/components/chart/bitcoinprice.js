import React from 'react'
import { compose } from 'recompose'
import Chart from './chart'
import formatPrice from 'utils/formatPrice'

import './bitcoinprice.css'

// @ts-ignore
import { withParentSize, withScreenSize } from '@vx/responsive'

function BitcoinPrice ({ data, parentWidth, screenHeight }) {
  const prices = data || []

  const currentPrice = prices.length ? prices[prices.length - 1].price : 0
  const firstPrice = prices.length ? prices[0].price : 0
  const diffPrice = currentPrice - firstPrice
  const hasIncreased = diffPrice > 0

  return (
    <div className="bitcoin">
      <div className="chartTitle">
        <div>
          Bitcoin Price<br />
          <small>last 30 days</small>
        </div>
        <div className="spacer" />
        <div className="stats">
          <div className="current">{formatPrice(currentPrice)}</div>
          <div className={hasIncreased ? 'diffIncrease' : 'diffDecrease'}>
            {hasIncreased ? '+' : '-'}
            {formatPrice(diffPrice)}
          </div>
        </div>
      </div>
      <div className="chart">
        <Chart
          data={prices}
          parentWidth={parentWidth}
          parentHeight={screenHeight * 0.4}
          margin={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 45
          }}
        />
      </div>
    </div>
  )
}

export default compose(withParentSize, withScreenSize)(BitcoinPrice)
