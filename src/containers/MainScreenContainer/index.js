import React from 'react'
// @ts-ignore
import { get, keys } from 'lodash/fp'
import { Container, Section, Columns, Column } from 'bloomer'

import AppLayout from 'components/AppLayout'
import PortfolioStats from 'components/PortfolioStats'
import { compose, lifecycle, pure, withPropsOnChange } from 'recompose'
import { connect } from 'react-redux'
import { fetchInitData } from 'store/actions'
import ChartContainer from 'containers/ChartContainer'
import ExchangesListContainer from 'containers/ExchangesListContainer'
import PortfolioListContainer from 'containers/PortfolioListContainer'
import { exchangeByIdSelector } from 'store/modules/exchanges'
import {
  marketValueSelector,
  portfolioPerformanceSelector
} from 'store/selectors'
import {
  quoteSymbolSelector,
  activeExchangeFilterIdSelector,
  activeSymbolFilterSelector
} from 'store/modules/core'
import {
  activeTimeFrameSelector,
  currentPriceDataStateSelector
} from 'store/modules/priceData'
import { apiKeysSelector } from 'store/modules/apiKeys'

const renderMainScreen = ({
  marketValue,
  quoteSymbol,
  exchangeFilterId,
  exchangeFilterName,
  symbolFilterId,
  activeTimeFrame,
  symbolFilterPrice,
  portfolioPerformance,
  appIsNotEmpty
}) => (
  <AppLayout>
    {appIsNotEmpty ? (
      <React.Fragment>
        <Section>
          <Container>
            <PortfolioStats
              marketValue={marketValue}
              quoteSymbol={quoteSymbol}
              exchangeFilterName={exchangeFilterName}
              symbolFilter={symbolFilterId}
              symbolCurrentPrice={symbolFilterPrice}
              activeTimeFrame={activeTimeFrame}
              portfolioPerformance={portfolioPerformance}
            />
          </Container>
        </Section>
        <ChartContainer
          exchangeFilter={exchangeFilterId}
          symbolFilter={symbolFilterId}
          activeTimeFrame={activeTimeFrame}
        />

        <Section>
          <Container className="is-tablet">
            <Columns isMultiline>
              <Column
                isSize={{
                  mobile: 'full',
                  tablet: 'full',
                  desktop: 'full',
                  widescreen: '1/2'
                }}
              >
                <PortfolioListContainer
                  exchangeFilterName={exchangeFilterName}
                  exchangeFilter={exchangeFilterId}
                  symbolFilter={symbolFilterId}
                />
              </Column>
              <Column
                isSize={{
                  mobile: 'full',
                  tablet: 'full',
                  desktop: 'full',
                  widescreen: '1/2'
                }}
              >
                <ExchangesListContainer />
              </Column>
            </Columns>
          </Container>
        </Section>
      </React.Fragment>
    ) : (
      <Section>
        <Container>
          <ExchangesListContainer />
        </Container>
      </Section>
    )}
  </AppLayout>
)

const Main = compose(
  connect(state => ({
    exchangeFilterId: activeExchangeFilterIdSelector(state),
    symbolFilterId: activeSymbolFilterSelector(state)
  })),
  connect(
    (state, { exchangeFilterId, symbolFilterId }) => ({
      filterExchange: exchangeByIdSelector(exchangeFilterId)(state),
      marketValue: marketValueSelector({
        exchangeId: exchangeFilterId,
        symbol: symbolFilterId
      })(state),
      quoteSymbol: quoteSymbolSelector(state),
      currentPriceData: currentPriceDataStateSelector(state),
      activeTimeFrame: activeTimeFrameSelector(state),
      portfolioPerformance: portfolioPerformanceSelector({
        exchangeId: exchangeFilterId,
        symbol: symbolFilterId
      })(state),
      exchanges: apiKeysSelector(state)
    }),
    dispatch => ({
      fetchInitData: () => dispatch(fetchInitData())
    })
  ),
  withPropsOnChange(['exchanges'], ({ exchanges }) => {
    return {
      appIsNotEmpty: !!keys(exchanges).length
    }
  }),
  withPropsOnChange(['filterExchange'], ({ filterExchange }) => ({
    exchangeFilterName: filterExchange ? get('name', filterExchange) : null
  })),
  withPropsOnChange(
    ['currentPriceData', 'symbolFilterId'],
    ({ currentPriceData = {}, symbolFilterId }) => ({
      symbolFilterPrice: currentPriceData[symbolFilterId]
    })
  ),
  lifecycle({
    componentDidMount () {
      this.props.fetchInitData()
    }
  }),
  pure
)(renderMainScreen)

export default Main
