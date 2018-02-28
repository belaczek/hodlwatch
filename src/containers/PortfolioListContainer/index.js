import React from 'react'
import { connect } from 'react-redux'
// @ts-ignore
import { get, keys } from 'lodash/fp'
import {
  compose,
  withPropsOnChange,
  withHandlers,
  onlyUpdateForKeys
} from 'recompose'
import { portfolioSymbolsSelector } from 'store/modules/portfolio'

import { Title } from 'bloomer/lib/elements/Title'
import { Table } from 'bloomer/lib/elements/Table'

import './index.css'
import { setSymbolFilter, quoteSymbolSelector } from 'store/modules/core'
import scrollToTop from 'utils/scrollToTop'
import { currentPriceDataSelector, marketValueSelector } from 'store/selectors'
import { roundValue } from 'utils/calcFloat'

// TODO
const renderPortfolioSection = ({
  symbols,
  handleSetFilter,
  exchangeFilter,
  exchangeFilterName,
  quoteSymbol
}) => (
  <div className="PortfolioList">
    <Title isSize={5}>
      portfolio {exchangeFilterName && ` at ${exchangeFilterName}`}
    </Title>
    <Table className="PortfolioList--table is-fullwidth">
      <tbody>
        <tr>
          <td />
          <td className="u-textRight">
            <strong>price</strong>
          </td>
          <td className="u-textRight">
            <strong>amount</strong>
          </td>
          <td className="u-textRight">
            <strong>market value</strong>
          </td>
        </tr>
        {symbols &&
          symbols.map(({ name, price, amount, marketValue }) => (
            <tr className="bg-light" key={name}>
              <td>
                <Title isSize={6}>
                  <a title="show detail" onClick={() => handleSetFilter(name)}>
                    {name}
                  </a>
                </Title>
              </td>
              <td className="u-textRight">
                {price} {quoteSymbol}
              </td>
              <td className="u-textRight">{amount}</td>
              <td className="u-textRight">
                {marketValue} {quoteSymbol}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  </div>
)

const PortfolioSection = compose(
  connect(
    (state, { exchangeFilter: exchangeId, symbolFilter: symbol }) => ({
      symbols: portfolioSymbolsSelector({ exchangeId, symbol })(state),
      prices: currentPriceDataSelector({ exchangeId, symbol })(state),
      quoteSymbol: quoteSymbolSelector(state),

      // make market value selector callable from the component
      getMarketValueBySymbolId: symbol => marketValueSelector({ symbol })(state)
    }),
    dispatch => ({
      setFilter: id => dispatch(setSymbolFilter(id))
    })
  ),
  withPropsOnChange(
    ['symbols', 'prices'],
    ({ symbols, prices, getMarketValueBySymbolId }) => {
      const symbolKeys = keys(symbols)

      const enhancedSymbols = symbolKeys.map(key => ({
        amount: symbols[key],
        price: get(key, prices),
        marketValue: roundValue(getMarketValueBySymbolId(key)),
        name: key
      }))

      return { symbols: enhancedSymbols }
    }
  ),
  withHandlers({
    handleSetFilter: ({ setFilter }) => id => {
      setFilter(id)
      scrollToTop()
    }
  }),
  onlyUpdateForKeys(['symbols'])
)

export default PortfolioSection(renderPortfolioSection)
