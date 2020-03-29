import React from "react";
// @ts-ignore
import { get } from "lodash/fp";
import classnames from "classnames";
import { compose, pure, withPropsOnChange, withProps } from "recompose";
import { Level, LevelItem, Heading, Title } from "bloomer";
import { roundValue } from "utils/calcFloat";
import { TIME_FRAMES } from "appConstants";

const Performace = ({ value, symbol = "%" }) => (
  <span>
    {value >= 0 && "+"}
    {value} {symbol}
  </span>
);

const renderStats = ({
  marketValue,
  symbolFilter,
  exchangeFilterName,
  tfLongName,
  quoteSymbol,
  symbolCurrentPrice,
  protfolioPerformanceAbs,
  protfolioPerformancePerc,
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
    {symbolFilter && symbolCurrentPrice ? (
      <LevelItem hasTextAlign="centered">
        <div>
          <Heading>Current Price</Heading>
          <Title isSize={4}>
            {symbolCurrentPrice} {quoteSymbol}
          </Title>
        </div>
      </LevelItem>
    ) : null}
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>Portfolio Market Value</Heading>
        <Title isSize={4}>
          {marketValue} {quoteSymbol}
        </Title>
      </div>
    </LevelItem>

    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>{tfLongName} change</Heading>
        <Title
          isSize={5}
          hasTextColor={classnames(
            protfolioPerformanceAbs >= 0 ? "success" : "danger"
          )}
        >
          {!!protfolioPerformancePerc && (
            <Performace value={protfolioPerformancePerc} />
          )}{" "}
          (<Performace value={protfolioPerformanceAbs} symbol={quoteSymbol} />)
        </Title>
      </div>
    </LevelItem>
  </Level>
);

export default compose(
  pure,
  withProps(({ activeTimeFrame, portfolioPerformance = {} }) => ({
    tfLongName: get([activeTimeFrame, "longName"], TIME_FRAMES),
    protfolioPerformanceAbs: portfolioPerformance.absolute,
    protfolioPerformancePerc: portfolioPerformance.relative,
  })),
  withPropsOnChange(["marketValue"], ({ marketValue }) => ({
    marketValue: roundValue(marketValue),
  }))
)(renderStats);
