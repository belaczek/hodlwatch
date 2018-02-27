import React from 'react'
// @ts-ignore
import { get } from 'lodash/fp'
import { compose, pure, withPropsOnChange, withProps } from 'recompose'
import { Level, LevelItem, Heading, Title } from 'bloomer'
import { roundValue } from 'utils/calcFloat'
import { timeframes } from 'store/modules/priceData'

const renderStats = ({
  detailTitle = 'Portfolio',
  marketValue,
  symbolFilter,
  exchangeFilterName,
  tfLongName,
  quoteSymbol,
  symbolCurrentPrice
}) => (
  <Level>
    {symbolFilter || exchangeFilterName ? (
      <LevelItem hasTextAlign="centered">
        <div>
          <Heading>Detail</Heading>
          <Title isSize={5}>
            {exchangeFilterName} {symbolFilter}
          </Title>
        </div>
      </LevelItem>
    ) : null}
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>Portfolio Market Value</Heading>
        <Title isSize={5}>
          {marketValue} {quoteSymbol}
        </Title>
      </div>
    </LevelItem>
    {symbolFilter && symbolCurrentPrice ? (
      <LevelItem hasTextAlign="centered">
        <div>
          <Heading>Current Price</Heading>
          <Title isSize={5}>
            {symbolCurrentPrice} {quoteSymbol}
          </Title>
        </div>
      </LevelItem>
    ) : null}
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>{tfLongName} change</Heading>
        <Title isSize={6} hasTextColor="success">
          +100 % (+$6000)
        </Title>
      </div>
    </LevelItem>
  </Level>
)

export default compose(
  withProps(({ activeTimeFrame }) => ({
    tfLongName: get([activeTimeFrame, 'longName'], timeframes)
  })),
  withPropsOnChange(['marketValue'], ({ marketValue }) => ({
    marketValue: roundValue(marketValue)
  })),
  pure
)(renderStats)
