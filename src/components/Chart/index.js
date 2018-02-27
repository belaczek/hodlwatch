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

import './index.css'

const renderChart = ({ data, baseSymbols }) => (
  <div className="mainChart">
    <ResponsiveContainer width="100%" aspect={2.5} debounce={1}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="time"
          minTickGap={40}
          interval="preserveStartEnd"
          tickLine={false}
          tick={{ fontSize: '12px' }}
        />
        <YAxis
          type="number"
          domain={['dataMin', 'dataMax']}
          tick={{ fontSize: '12px' }}
          mirror
          tickLine={false}
          tickCount={5}
          axisLine={false}
          width={30}
        />
        <Tooltip />
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
