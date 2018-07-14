import React from 'react'
// @ts-ignore
import { get } from 'lodash/fp'
import { Title, Button, Box, Table } from 'bloomer'
import {
  compose,
  withHandlers,
  withState,
  withProps,
  onlyUpdateForKeys
} from 'recompose'
import { connect } from 'react-redux'
import {
  savedExchangesListSelector,
  marketValueSelector
} from 'store/selectors'
import { setExchangeFilter, quoteSymbolSelector } from 'store/modules/core'
import ExchangeApiForm from 'containers/ExchangeApiForm'
import { portfolioStateSelecor } from 'store/modules/portfolio'
import { roundValue } from 'utils/calcFloat'
import Spinner from 'components/Spinner'

import './index.sass'
import { fetchInitData } from 'store/actions'
import scrollToTop from 'utils/scrollToTop'

// TODO
const renderExchangeSection = ({
  exchanges,
  handleSetFilter,
  editExchangeId,
  showExchangeForm,
  handleFormCancel,
  handleFormSuccess,
  quoteSymbol,
  handleOpenExchangeForm,
  refreshData,
  appIsNotEmpty
}) => (
  <div className="ExchangesList">
    {appIsNotEmpty && (
      <div className="ExchangesList--title">
        <Title isSize={5}>exchanges</Title>
        <Button
          className="ml-10"
          isOutlined
          isSize="small"
          isColor="black"
          onClick={refreshData}
        >
          refresh
        </Button>
      </div>
    )}
    {showExchangeForm && (
      <Box>
        <ExchangeApiForm
          editExchangeId={editExchangeId}
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </Box>
    )}

    <Table className="is-fullwidth">
      <tbody>
        {appIsNotEmpty && (
          <React.Fragment>
            <tr>
              <td />
              <td className="u-textRight">
                <strong>market&nbsp;value</strong>
              </td>
              <td />
            </tr>
            {exchanges.map(
              ({ name, id, marketValue, portfolioError, portfolioLoading }) => (
                <tr key={id}>
                  <td>
                    <div className="ExchangesList--exchangeNameColumn">
                      <Title isSize={6}>
                        <a onClick={() => handleSetFilter(id)}>{name}</a>
                      </Title>
                      {portfolioLoading && <Spinner />}
                    </div>
                    {portfolioError && (
                      <p className="has-text-danger">
                        failed to fetch portfolio data
                      </p>
                    )}
                  </td>
                  <td className="has-text-right">
                    <span>
                      {marketValue} {quoteSymbol}
                    </span>
                  </td>
                  <td className="u-textCenter">
                    <Button
                      isOutlined
                      isSize="small"
                      isColor="black"
                      onClick={() => handleOpenExchangeForm(id)}
                    >
                      edit
                    </Button>
                  </td>
                </tr>
              )
            )}
          </React.Fragment>
        )}
        <tr>
          <td className="u-textCenter" colSpan={3}>
            {!showExchangeForm && (
              <Button
                isColor="success"
                onClick={() => handleOpenExchangeForm()}
              >
                add exchange
              </Button>
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)

const ExchangeSection = compose(
  connect(
    state => ({
      exchanges: savedExchangesListSelector(state),
      portfolio: portfolioStateSelecor(state),
      quoteSymbol: quoteSymbolSelector(state),

      // make market value selector callable from the component
      getMarketValueByExchangeId: exchangeId =>
        marketValueSelector({ exchangeId })(state)
    }),
    dispatch => ({
      setFilter: id => dispatch(setExchangeFilter(id)),
      refreshData: () => dispatch(fetchInitData())
    })
  ),
  withProps(({ exchanges, portfolio, getMarketValueByExchangeId }) => {
    const enhancedExchanges = exchanges.map((ex, index) => {
      const { id } = ex
      const portfolioData = get([id], portfolio) || {}

      return {
        ...ex,
        portfolioError: portfolioData.error,
        portfolioLoading: portfolioData.loading,
        marketValue: roundValue(getMarketValueByExchangeId(id))
      }
    })

    return {
      exchanges: enhancedExchanges,
      appIsNotEmpty: !!enhancedExchanges.length
    }
  }),
  withState('showExchangeForm', 'setExchangeFormState', false),
  withState('editExchangeId', 'setEditExchangeId', null),
  withHandlers({
    handleFormCancel: ({ setExchangeFormState, setEditExchangeId }) => () => {
      setExchangeFormState(false)
      setEditExchangeId(null)
    },
    handleFormSuccess: ({ setExchangeFormState, setEditExchangeId }) => () => {
      setExchangeFormState(false)
      setEditExchangeId(null)
    },
    handleOpenExchangeForm: ({
      setExchangeFormState,
      setEditExchangeId
    }) => id => {
      setEditExchangeId(() => id)
      setExchangeFormState(true)
    },
    handleSetFilter: ({ setFilter }) => id => {
      setFilter(id)
      scrollToTop()
    }
  }),
  onlyUpdateForKeys(['exchanges', 'showExchangeForm'])
)

export default ExchangeSection(renderExchangeSection)
