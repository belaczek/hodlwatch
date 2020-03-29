import reducer, {
  portfolioStateSelecor,
  portfolioSymbolsSelector,
} from "../modules/portfolio";

const initialState = {};

test("reducer should return initial state", () => {
  const state = reducer(undefined, {});
  expect(state).toEqual(initialState);
});

describe("portfolio actions", () => {
  const DELETE_PORTFOLIO_DATA = "DELETE_PORTFOLIO_DATA";
  const PORTFOLIO_DATA_LOADING = "PORTFOLIO_DATA_LOADING";
  const PORTFOLIO_DATA_FAILURE = "PORTFOLIO_DATA_FAILURE";
  const PORTFOLIO_DATA_SUCCESS = "PORTFOLIO_DATA_SUCCESS";

  test("should set exchange loading", () => {
    const state = reducer(initialState, {
      type: PORTFOLIO_DATA_LOADING,
      payload: { exchangeId: "test" },
    });
    expect(state).toHaveProperty("test");
    expect(state.test).toHaveProperty("loading", true);
    expect(state.test.error).toBeFalsy();
  });

  test("should set exchange error", () => {
    let state = reducer(initialState, {
      type: PORTFOLIO_DATA_LOADING,
      payload: { exchangeId: "test" },
    });
    state = reducer(state, {
      type: PORTFOLIO_DATA_FAILURE,
      payload: {
        exchangeId: "test",
        error: "testError",
      },
    });
    expect(state).toHaveProperty("test");
    expect(state.test).toHaveProperty("loading", false);
    expect(state.test).toHaveProperty("error", "testError");
  });

  test("should set exchange data", () => {
    const testExchange = {
      exchangeId: "testExchange",
      error: null,
      loading: false,
      data: {
        BTC: 1,
        LTC: 2,
      },
    };

    let state = reducer(initialState, {
      type: PORTFOLIO_DATA_SUCCESS,
      payload: { exchangeId: testExchange.exchangeId, data: testExchange.data },
    });

    state = reducer(state, {
      type: PORTFOLIO_DATA_SUCCESS,
      payload: { exchangeId: "test2", data: testExchange.data },
    });

    expect(state).toHaveProperty(testExchange.exchangeId);
    expect(state).toHaveProperty("test2");
    expect(state.testExchange).toHaveProperty("error", testExchange.error);
    expect(state.testExchange).toHaveProperty("loading", testExchange.loading);
    expect(state.testExchange).toHaveProperty("data", testExchange.data);
    expect(state.testExchange).toHaveProperty("lastUpdated");
  });

  test("should delete target exchange record", () => {
    const testExchange = {
      exchangeId: "testExchange",
      error: null,
      loading: false,
      data: {
        BTC: 1,
        LTC: 2,
      },
    };

    let state = reducer(initialState, {
      type: PORTFOLIO_DATA_SUCCESS,
      payload: { ...testExchange },
    });

    state = reducer(state, {
      type: PORTFOLIO_DATA_SUCCESS,
      payload: { ...testExchange, exchangeId: "testExchange2" },
    });

    state = reducer(state, {
      type: DELETE_PORTFOLIO_DATA,
      payload: { exchangeId: "testExchange2" },
    });

    expect(state).toHaveProperty(testExchange.exchangeId);
    expect(state).not.toHaveProperty("testExchange2");
  });
});

describe("portfolio selectors", () => {
  const testState = {
    portfolio: {
      coinmate: {
        error: null,
        loading: false,
        data: {
          BTC: 1,
          LTC: 2,
        },
      },
      bitfinex: {
        error: null,
        loading: false,
        data: {
          BTC: 0.05,
          XMR: 1,
        },
      },
    },
  };

  test("should select portfolio module state", () => {
    const res = portfolioStateSelecor(testState);
    expect(res).toEqual(testState.portfolio);
  });

  test("should select symbols of target exchange", () => {
    const res = portfolioSymbolsSelector({ exchangeId: "coinmate" })(testState);
    expect(res).toEqual(testState.portfolio.coinmate.data);
  });

  test("should select sum of target symbol across exchanges", () => {
    const res = portfolioSymbolsSelector({ symbol: "BTC" })(testState);
    expect(res).toEqual({ BTC: 1.05 });
  });

  test("should select sum of all symbols across exchanges", () => {
    const res = portfolioSymbolsSelector()(testState);
    expect(res).toEqual({ BTC: 1.05, LTC: 2, XMR: 1 });
  });

  test("should not select not existing symbol", () => {
    const res = portfolioSymbolsSelector({ symbol: "XXX" })(testState);
    expect(res).toEqual({});
  });

  test("should not select symbols from not existing exchange", () => {
    const res = portfolioSymbolsSelector({ exchangeId: "XXX" })(testState);
    expect(res).toEqual({});
  });
});
