import { TF_1M, DEFAULT_QUOTE_SYMBOL, DEFAULT_PROXY_URL } from "appConstants";
import {
  savedExchangesListSelector,
  unusedExchangesListSelector,
  activeExchangeFilterSelector,
  histoDataSelector,
  currentPriceDataSelector,
  marketValueSelector,
  portfolioPerformanceSelector
} from "../selectors";

describe("global selectors", () => {
  const testState = {
    core: {
      init: false,
      serviceWorkerUpdated: false,
      exchangeFilterId: null,
      symbolFilterId: null,
      quoteSymbol: DEFAULT_QUOTE_SYMBOL
    },
    modals: {
      modalType: "TEST_MODAL",
      props: {
        a: "b"
      }
    },
    priceData: {
      histoDataLoading: false,
      histoDataError: false,
      histoDataLastUpdated: null,
      histoData: {
        BTC: [
          {
            time: 1,
            close: 99,
            high: 110,
            low: 90,
            open: 99,
            volumeFrom: 100,
            volumeTo: 200
          },
          {
            time: 2,
            close: 200,
            high: 250,
            low: 90,
            open: 100,
            volumeFrom: 200,
            volumeTo: 300
          }
        ],
        LTC: [
          {
            time: 1,
            high: 110,
            low: 20,
            close: 30,
            open: 99,
            volumeFrom: 100,
            volumeTo: 200
          },
          {
            time: 2,
            close: 200,
            high: 250,
            low: 90,
            open: 100,
            volumeFrom: 200,
            volumeTo: 300
          }
        ],
        XMR: [
          {
            time: 1,
            high: 110,
            low: 90,
            close: 100,
            open: 99,
            volumeFrom: 100,
            volumeTo: 200
          },
          {
            time: 2,
            close: 200,
            high: 250,
            low: 90,
            open: 100,
            volumeFrom: 200,
            volumeTo: 300
          }
        ]
      },
      timeframe: TF_1M,

      currentPriceDataLoading: false,
      currentPriceDataError: false,
      currentPriceDataLastUpdated: null,
      currentPriceData: {
        BTC: 100,
        LTC: 50,
        XMR: 51
      }
    },
    portfolio: {
      coinmate: {
        error: null,
        loading: false,
        data: {
          BTC: 1,
          LTC: 2
        }
      },
      bitfinex: {
        error: null,
        loading: false,
        data: {
          BTC: 0.05
        }
      }
    },
    exchanges: {
      loading: false,
      error: "testerror",
      data: [
        { name: "CoinMate", id: "coinmate" },
        { name: "Bittrex", id: "bittrex" },
        { name: "Bitfinex", id: "bitfinex" }
      ]
    },
    apiKeys: {
      useGlobalApiProxy: true,
      globalProxyUrl: DEFAULT_PROXY_URL,
      data: {
        bittrex: {
          apiKey: 1234,
          exchangeId: "bittrex",
          private: "private"
        },
        coinmate: {
          apiKey: 12345,
          exchangeId: "coinmate",
          private: "private",
          proxy: "proxy"
        }
      }
    }
  };

  test("should get list of connected exchanges", () => {
    const res = savedExchangesListSelector(testState);
    expect(res).toEqual([
      { name: "Bittrex", id: "bittrex" },
      { name: "CoinMate", id: "coinmate" }
    ]);
  });

  test("should get list of unused exchanges", () => {
    const res = unusedExchangesListSelector(testState);
    expect(res).toEqual([{ name: "Bitfinex", id: "bitfinex" }]);
  });

  test("should get active filtering exchange", () => {
    const res = activeExchangeFilterSelector(testState);
    expect(res).toBeFalsy();
  });

  test("should get list of unused exchanges", () => {
    const state = {
      ...testState,
      core: { ...testState.core, exchangeFilterId: "coinmate" }
    };
    const res = activeExchangeFilterSelector(state);
    expect(res).toEqual({ name: "CoinMate", id: "coinmate" });
  });

  // histo data

  test("should get all histo data for all holded symbols", () => {
    const res = histoDataSelector()(testState);
    const { XMR, ...testData } = testState.priceData.histoData;
    expect(res).toEqual(testData);
  });

  test("should get histo data of target symbol", () => {
    const res = histoDataSelector({ symbol: "BTC" })(testState);
    const testData = { BTC: testState.priceData.histoData.BTC };
    expect(res).toEqual(testData);
  });

  test("should get histo data of target connected exchange", () => {
    const res = histoDataSelector({ exchangeId: "coinmate" })(testState);
    const { XMR, ...testData } = testState.priceData.histoData;
    expect(res).toEqual(testData);
  });

  test("should not get histo data of falsy exchange", () => {
    const res = histoDataSelector({ exchangeId: "bla" })(testState);
    expect(res).toEqual({});
  });

  test("should not get histo data of falsy symbol", () => {
    const res = histoDataSelector({ symbol: "ble" })(testState);
    expect(res).toEqual({});
  });

  // current price data

  test("should get all histo data for all holded symbols", () => {
    const res = currentPriceDataSelector()(testState);
    const { XMR, ...testData } = testState.priceData.currentPriceData;
    expect(res).toEqual(testData);
  });

  test("should get histo data of target symbol", () => {
    const res = currentPriceDataSelector({ symbol: "BTC" })(testState);
    const testData = { BTC: testState.priceData.currentPriceData.BTC };
    expect(res).toEqual(testData);
  });

  test("should get histo data of target connected exchange", () => {
    const res = currentPriceDataSelector({ exchangeId: "coinmate" })(testState);
    const { XMR, ...testData } = testState.priceData.currentPriceData;
    expect(res).toEqual(testData);
  });

  test("should not get histo data of falsy exchange", () => {
    const res = currentPriceDataSelector({ exchangeId: "bla" })(testState);
    expect(res).toEqual({});
  });

  test("should not get histo data of falsy symbol", () => {
    const res = currentPriceDataSelector({ symbol: "ble" })(testState);
    expect(res).toEqual({});
  });

  // market value

  test("should select total market value of portfolio", () => {
    const res = marketValueSelector()(testState);
    expect(res).toEqual(205);
  });

  test("should select total market value of target symbol", () => {
    const res = marketValueSelector({ symbol: "LTC" })(testState);
    expect(res).toEqual(100);
  });

  test("should select total market value of target exchange account", () => {
    const res = marketValueSelector({ exchangeId: "coinmate" })(testState);
    expect(res).toEqual(200);
  });

  // portfolio performance

  test("should select performance of portfolio", () => {
    const res = portfolioPerformanceSelector()(testState);
    expect(res).toMatchSnapshot();
  });

  test("should select performance of target symbol", () => {
    const res = portfolioPerformanceSelector({ symbol: "LTC" })(testState);
    expect(res).toMatchSnapshot();
  });

  test("should select performance of target exchange account", () => {
    const res = portfolioPerformanceSelector({ exchangeId: "coinmate" })(
      testState
    );
    expect(res).toMatchSnapshot();
  });
});
