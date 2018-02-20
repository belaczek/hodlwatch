import React from 'react'
import { Columns, Container, Section, Title } from 'bloomer'

import AppLayout from 'components/AppLayout'
import PortfolioStats from 'components/PortfolioStats'
import { compose, lifecycle, pure, withProps, withState } from 'recompose'
import { connect } from 'react-redux'
import { exchangesDataSelector } from 'store/selectors'
import ExchangeApiForm from 'containers/ExchangeApiForm'
import { fetchInitData } from 'store/actions'
import ChartSection from 'containers/ChartSection'
import ExchangeSection from 'containers/ExchangeSection'
import PortfolioSection from 'containers/PortfolioSection'

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
    <ChartSection />
    <PortfolioSection />
    <Section>
      <Container>
        <Title isSize={4}>Add new exchange connection</Title>
        <ExchangeApiForm />
      </Container>
    </Section>
    <ExchangeSection />
    <Section>
      <Container>
        <Columns>
          {/* <Column>
            <Title isSize={5}>Supported Exchanges</Title>
            {exchangesIsLoading && <Spinner />}
            {exchangesError && (
              <p className="has-text-danger">Failed to get exchanges</p>
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
          </Column> */}
          {/* <Column>
            <Title isSize={5}>Currency pairs</Title>
            {marketsIsLoading && <Spinner />}
            {marketsIsError && (
              <p className="has-text-danger">{marketsIsError}</p>
            )}
            <ul>{markets.map(t => <li key={t}>{t}</li>)}</ul>
          </Column> */}
        </Columns>
      </Container>
    </Section>
  </AppLayout>
)

const Main = compose(
  connect(state => ({})),
  connect(
    state => ({
      exchangesData: exchangesDataSelector(state)
    }),
    dispatch => ({
      fetchInitData: () => dispatch(fetchInitData())
    })
  ),
  withState('markets', 'setMarkets', {
    data: [],
    loading: false,
    error: false
  }),
  withProps(
    ({
      exchangesData: {
        data: exchanges,
        loading: exchangesIsLoading,
        error: exchangesError
      }
    }) => ({
      exchanges,
      exchangesIsLoading,
      exchangesError
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
