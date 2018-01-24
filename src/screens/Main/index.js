import React from 'react'
import {
  Column,
  Columns,
  Container,
  Section,
  Title,
  Field,
  Select,
  Label,
  Control
} from 'bloomer'

import AppLayout from '../AppLayout'
import Chart from '../../components/Chart'
import PortfolioStats from '../../components/PortfolioStats'
import {
  compose,
  lifecycle,
  pure,
  withHandlers,
  withProps,
  withState
} from 'recompose'
import { connect } from 'react-redux'
import { exchangesDataSelector, selectExchangeByName } from 'store/selectors'
import { fetchCcxtExchanges } from 'store/modules/marketData'
import Spinner from 'components/Spinner'

const enhance = compose(
  connect(
    state => ({
      exchangesData: exchangesDataSelector(state),
      getExchangeByName: name => selectExchangeByName(name)(state)
    }),
    dispatch => ({
      fetchExchanges: async () => dispatch(fetchCcxtExchanges())
    })
  ),
  withState('markets', 'setMarkets', {
    data: [],
    loading: false,
    error: false
  }),
  withHandlers({
    getMarkets: ({ getExchangeByName, setMarkets }) => async name => {
      setMarkets(state => ({ ...state, loading: true, error: false }))
      try {
        const exchange = getExchangeByName(name)
        await exchange.loadMarkets()
        setMarkets(state => ({
          data: exchange.symbols,
          loading: false,
          error: false
        }))
      } catch (error) {
        console.log(error)
        setMarkets(state => ({
          data: [],
          loading: false,
          error: error.message
        }))
      }
    }
  }),
  withProps(
    ({
      exchangesData: {
        data: exchanges,
        loading: exchangesIsLoading,
        error: exchangesError
      },
      markets: {
        data: markets,
        loading: marketsIsLoading,
        error: marketsIsError
      }
    }) => ({
      exchanges,
      exchangesIsLoading,
      exchangesError,
      markets,
      marketsIsLoading,
      marketsIsError
    })
  ),
  lifecycle({
    componentWillMount () {
      this.props.fetchExchanges()
    }
  }),
  pure
)

const renderMainScreen = ({
  exchanges = [],
  exchangesIsLoading,
  exchangesError,
  markets = [],
  marketsIsLoading,
  marketsIsError,
  getMarkets
}) => (
  <AppLayout>
    <PortfolioStats />
    <Container>
      <Chart />
    </Container>
    <Section>
      <Container>
        <Columns>
          <Column>
            <Title isSize={5}>Exchanges</Title>
            {exchangesIsLoading && <Spinner />}
            {exchangesError && (
              <p className='has-text-danger'>Failed to get exchanges</p>
            )}
            {exchanges.length && (
              <Field>
                <Label>Select:</Label>
                <Control>
                  <Select onChange={e => getMarkets(e.target.value)}>
                    {exchanges.map(({ name }) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </Control>
              </Field>
            )}
          </Column>
          <Column>
            <Title isSize={5}>Currency pairs</Title>
            {marketsIsLoading && <Spinner />}
            {marketsIsError && (
              <p className='has-text-danger'>{marketsIsError}</p>
            )}
            <ul>{markets.map(t => <li key={t}>{t}</li>)}</ul>
          </Column>
        </Columns>
      </Container>
    </Section>
  </AppLayout>
)

const Main = enhance(renderMainScreen)

export default Main
