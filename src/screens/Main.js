import React from "react";
import AppLayout from "./AppLayout";
import Chart from "../components/Chart";
import PortfolioStats from "../components/PortfolioStats";
import {
  compose,
  lifecycle,
  withProps,
  pure,
  withHandlers,
  withState
} from "recompose";
import { connect } from "react-redux";
import {
  exchangesDataSelector,
  selectExchangeByName
} from "../store/selectors";
import { fetchCcxtExchanges } from "../store/modules/marketData";

const Spinner = () => (
  <div className="Spinner">
    <div className="loader" />
  </div>
);

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
    <div className="container">
      <Chart />
    </div>
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <h1 className="title is-5">Exchanges</h1>
            {exchangesIsLoading && <Spinner />}
            {exchangesError && (
              <p className="has-text-danger">Failed to get exchanges</p>
            )}
            {exchanges.length ? (
              <ul>
                {exchanges.map(({ name }) => (
                  <li key={name}>
                    <a onClick={() => getMarkets(name)}>{name}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="column">
            <h1 className="title is-5">Currency pairs</h1>
            {marketsIsLoading && <Spinner />}
            {marketsIsError && (
              <p className="has-text-danger">{marketsIsError}</p>
            )}
            <ul>{markets.map(t => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
);

const Main = compose(
  connect(
    state => ({
      exchangesData: exchangesDataSelector(state),
      getExchangeByName: name => selectExchangeByName(name)(state)
    }),
    dispatch => ({
      fetchExchanges: async () => dispatch(fetchCcxtExchanges())
    })
  ),
  withState("markets", "setMarkets", {
    data: [],
    loading: false,
    error: false
  }),
  withHandlers({
    getMarkets: ({ getExchangeByName, setMarkets }) => async name => {
      setMarkets(state => ({ ...state, loading: true, error: false }));
      try {
        const exchange = getExchangeByName(name);
        await exchange.loadMarkets();
        setMarkets(state => ({
          data: exchange.symbols,
          loading: false,
          error: false
        }));
      } catch (error) {
        console.log(error);
        setMarkets(state => ({
          data: [],
          loading: false,
          error: error.message
        }));
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
    componentWillMount() {
      this.props.fetchExchanges();
    }
  }),
  pure
)(renderMainScreen);

export default Main;
