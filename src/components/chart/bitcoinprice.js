import React from 'react'
import Chart from './chart'
import formatPrice from 'utils/formatPrice'
import Spinner from 'components/Spinner'

import './bitcoinprice.css'

export default function BitcoinPrice ({ data = {}, width, height }) {
  if (!data.bpi) return <Spinner />

  const prices = Object.keys(data.bpi).map(k => ({
    time: k,
    price: data.bpi[k]
  }))

  const currentPrice = prices[prices.length - 1].price
  const firstPrice = prices[0].price
  const diffPrice = currentPrice - firstPrice
  const hasIncreased = diffPrice > 0

  return (
    <div className='bitcoin'>
      <div className='chartTitle'>
        <div>
          Bitcoin Price<br />
          <small>last 30 days</small>
        </div>
        <div className='spacer' />
        <div className='stats'>
          <div className='current'>{formatPrice(currentPrice)}</div>
          <div className={hasIncreased ? 'diffIncrease' : 'diffDecrease'}>
            {hasIncreased ? '+' : '-'}
            {formatPrice(diffPrice)}
          </div>
        </div>
      </div>
      <div className='chart'>
        <Chart
          data={prices}
          parentWidth={width}
          parentHeight={height * 0.4}
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
