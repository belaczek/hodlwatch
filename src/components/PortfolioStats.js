import React from 'react'
import { compose, pure, withPropsOnChange } from 'recompose'
import { Level, LevelItem, Heading, Title } from 'bloomer'
import { roundValue } from 'utils/calcFloat'

const renderStats = ({
  detailTitle = 'Portfolio',
  marketValue,
  symbolFilter,
  exchangeFilterName,
  quoteSymbol
}) => (
  <Level>
    {symbolFilter || exchangeFilterName ? (
      <LevelItem hasTextAlign="centered">
        <div>
          <Heading>Detail</Heading>
          <Title isSize={4}>
            {exchangeFilterName} {symbolFilter}
          </Title>
        </div>
      </LevelItem>
    ) : null}
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>Market Value</Heading>
        <Title isSize={4}>
          {marketValue} {quoteSymbol}
        </Title>
      </div>
    </LevelItem>
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>Daily change</Heading>
        <Title isSize={5} hasTextColor="success">
          +100 % (+$6000)
        </Title>
      </div>
    </LevelItem>
  </Level>
)

export default compose(
  withPropsOnChange(['marketValue'], ({ marketValue }) => ({
    marketValue: roundValue(marketValue)
  })),
  pure
)(renderStats)
