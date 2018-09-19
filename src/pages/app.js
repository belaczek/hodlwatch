import React from 'react'
// @ts-ignore
import { get, keys } from 'lodash/fp'
import { Container, Section, Columns, Column } from 'bloomer'
import Router from 'next/router'

import AppLayout from 'components/AppLayout'
import PortfolioStats from 'components/PortfolioStats'
import { compose, lifecycle, pure, withPropsOnChange } from 'recompose'
import { connect } from 'react-redux'
import { fetchInitData } from 'store/actions'
import ChartContainer from 'containers/ChartContainer'
import ExchangesListContainer from 'containers/ExchangesListContainer'
import PortfolioListContainer from 'containers/PortfolioListContainer'
import {
  marketValueSelector,
  portfolioPerformanceSelector,
  activeExchangeFilterSelector
} from 'store/selectors'
import {
  quoteSymbolSelector,
  activeExchangeFilterIdSelector,
  activeSymbolFilterSelector,
  appStateSelector
} from 'store/modules/core'
import {
  activeTimeFrameSelector,
  currentPriceDataStateSelector
} from 'store/modules/priceData'
import { apiKeysSelector } from 'store/modules/apiKeys'
import Redirect from 'components/Redirect'

/**
 * Render the main screen
 */
const MainScreen = ({
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

const renderMainScreen = props => (
  <React.Fragment>
    {!props.appIsInitialized ? (
      <Redirect to="/" replace />
    ) : (
      <MainScreen {...props} />
    )}
  </React.Fragment>
)

/**
 * Main screen component
 */
const Main = compose(
  connect(
    // Map store data to props
    state => {
      // Get id of current exchange filter
      const exchangeFilterId = activeExchangeFilterIdSelector(state)
      // Get current symbol filter
      const symbolFilterId = activeSymbolFilterSelector(state)
      return {
        appIsInitialized: appStateSelector(state),
        exchangeFilterId,
        symbolFilterId,
        // Get exchange based on filter id
        filterExchange: activeExchangeFilterSelector(state),
        // Get correct market value to be displayed (based on current filter)
        marketValue: marketValueSelector({
          exchangeId: exchangeFilterId,
          symbol: symbolFilterId
        })(state),
        // Get quote symbol (currency)
        quoteSymbol: quoteSymbolSelector(state),
        // Get latest price data
        currentPriceData: currentPriceDataStateSelector(state),
        // Get active time frame
        activeTimeFrame: activeTimeFrameSelector(state),
        // Get computed portfolio performance based on current filters
        portfolioPerformance: portfolioPerformanceSelector({
          exchangeId: exchangeFilterId,
          symbol: symbolFilterId
        })(state),
        // Get list of all connected exchanges
        exchanges: apiKeysSelector(state)
      }
    },
    // Map handler which dispatch an action to store
    dispatch => ({
      fetchInitData: () => dispatch(fetchInitData())
    })
  ),
  // When exchanges property changes, check whether or not there are any exchanges connected
  withPropsOnChange(['exchanges'], ({ exchanges }) => {
    return {
      appIsNotEmpty: !!keys(exchanges).length
    }
  }),
  // When filterExchanges changes, set new prop with its name
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
      const { appIsInitialized } = this.props
      if (!appIsInitialized) {
        return Router.push('/index')
      }
      // When the screen is loaded, trigger price data refetch
      this.props.fetchInitData()
    }
  }),
  // Only refresh the component on props change
  pure
)(renderMainScreen)

export default Main
