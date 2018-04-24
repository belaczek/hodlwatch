import React from 'react'
import { compose, pure, withProps } from 'recompose'
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer
} from 'recharts'

import { roundValue } from 'utils/calcFloat'

const formatYAxis = quoteSymbol => val => {
  if (val && val !== Infinity) {
    return `${roundValue(val)} ${quoteSymbol}`
  } else {
    return val
  }
}

const tooltipSorter = () => 1

const tooltipLabelFormatter = time => {
  return (
    <React.Fragment>
      <p className="u-text11px u-textUpperCase">portfolio market value</p>
      <p>
        <strong>{time}</strong>
      </p>
    </React.Fragment>
  )
}

const formatTooltipValue = quoteSymbol => value => (
  <span>
    {value} {quoteSymbol}
  </span>
)

/**
 * Static chart component
 */
const renderChart = ({ data, baseSymbols, quoteSymbol }) => (
  <div className="MainChart">
    <ResponsiveContainer width="100%" aspect={2.5} debounce={1}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="time"
          minTickGap={40}
          interval="preserveEnd"
          tickLine={false}
          tick={{ fontSize: '12px' }}
        />
        <YAxis
          className="MainChart-yAxis"
          type="number"
          domain={['dataMin', 'dataMax']}
          interval="preserveEnd"
          tick={{ fontSize: '12px' }}
          mirror
          tickLine={false}
          tickCount={5}
          axisLine={false}
          tickFormatter={formatYAxis(quoteSymbol)}
          width={100}
        />
        <Tooltip
          isAnimationActive={false}
          itemSorter={tooltipSorter}
          label="Protfolio Value"
          labelFormatter={tooltipLabelFormatter}
          formatter={formatTooltipValue(quoteSymbol)}
        />
        {baseSymbols &&
          baseSymbols.map(({ name, colour }) => (
            <Area
              key={name}
              isAnimationActive={false}
              type="linear"
              dataKey={name}
              stackId={1}
              stroke={colour}
              fill={colour}
            />
          ))}
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default compose(
  withProps(({ chartData, baseSymbols, quoteSymbol }) => ({
    data: chartData,
    baseSymbols
  })),
  pure
)(renderChart)
