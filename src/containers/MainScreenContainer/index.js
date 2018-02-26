import React from 'react'
// @ts-ignore
import { get } from 'lodash/fp'

import AppLayout from 'components/AppLayout'
import PortfolioStats from 'components/PortfolioStats'
import { compose, lifecycle, pure, withPropsOnChange } from 'recompose'
import { connect } from 'react-redux'
import { fetchInitData } from 'store/actions'
import ChartSection from 'containers/ChartSection'
import ExchangeSection from 'containers/ExchangeSection'
import PortfolioSection from 'containers/PortfolioSection'
import { exchangeByIdSelector } from 'store/modules/exchanges'
import { marketValueSelector } from 'store/selectors'
import {
  quoteSymbolSelector,
  activeExchangeFilterIdSelector,
  activeSymbolFilterSelector
} from 'store/modules/core'

const renderMainScreen = ({
  marketValue,
  quoteSymbol,
  exchangeFilterId,
  exchangeFilterName,
  symbolFilterId
}) => (
  <AppLayout>
    <PortfolioStats
      marketValue={marketValue}
      quoteSymbol={quoteSymbol}
      exchangeFilterName={exchangeFilterName}
      symbolFilter={symbolFilterId}
    />
    <ChartSection
      exchangeFilter={exchangeFilterId}
      symbolFilter={symbolFilterId}
    />
    <PortfolioSection
      exchangeFilter={exchangeFilterId}
      symbolFilter={symbolFilterId}
    />
    <ExchangeSection />
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
      quoteSymbol: quoteSymbolSelector(state)
    }),
    dispatch => ({
      fetchInitData: () => dispatch(fetchInitData())
    })
  ),
  withPropsOnChange(['filterExchange'], ({ filterExchange }) => ({
    exchangeFilterName: filterExchange ? get('name', filterExchange) : null
  })),
  lifecycle({
    componentDidMount () {
      this.props.fetchInitData()
    }
  }),
  pure
)(renderMainScreen)

export default Main
