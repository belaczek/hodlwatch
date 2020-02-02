import reducer, {
  setAppInitialized,
  updateServiceWorker,
  setSymbolFilter,
  setExchangeFilter,
  setQuoteCurrency,
  activeSymbolFilterSelector,
  appStateSelector,
  serviceWorkerIsUpdatedSelector,
  quoteSymbolSelector,
  activeExchangeFilterIdSelector,
  getInitializedCoreState
} from "store/modules/core";
import { DEFAULT_QUOTE_SYMBOL } from "appConstants";

const initialState = {
  init: false,
  serviceWorkerUpdated: false,
  exchangeFilterId: null,
  symbolFilterId: null,
  quoteSymbol: DEFAULT_QUOTE_SYMBOL
};

test("reducer should return initial state", () => {
  const state = reducer(undefined, {});
  expect(state).toEqual(initialState);
});

test("getInitalizedCoreState funtion should return initialized state", () => {
  const core = getInitializedCoreState();
  expect(core).toHaveProperty("init", true);
});

describe("core actions", () => {
  test("should set app initialized", () => {
    const state = reducer(initialState, setAppInitialized());
    expect(state).toHaveProperty("init", true);
  });

  test("should set sw update", () => {
    const state = reducer(initialState, updateServiceWorker());
    expect(state).toHaveProperty("serviceWorkerUpdated", true);
  });

  test("should set symbol filter", () => {
    const state = reducer(initialState, setSymbolFilter("BTC"));
    expect(state).toHaveProperty("symbolFilterId", "BTC");
  });

  test("should set exchange filter", () => {
    const state = reducer(initialState, setExchangeFilter("coinmate"));
    expect(state).toHaveProperty("exchangeFilterId", "coinmate");
  });

  test("should set quote currency", () => {
    const state = reducer(initialState, setQuoteCurrency("EUR"));
    expect(state).toHaveProperty("quoteSymbol", "EUR");
  });

  test("should not set invalid quote currency", () => {
    const state = reducer(initialState, setQuoteCurrency("EURO"));
    expect(state).toHaveProperty("quoteSymbol", DEFAULT_QUOTE_SYMBOL);
  });
});

describe("core selectors", () => {
  test("should select active filter", () => {
    const filter = "BTC";
    const state = { core: { ...initialState, symbolFilterId: filter } };
    expect(activeSymbolFilterSelector(state)).toEqual(filter);
  });

  test("should select symbol filter", () => {
    const filter = "BTC";
    const state = { core: { ...initialState, symbolFilterId: filter } };
    expect(activeSymbolFilterSelector(state)).toEqual(filter);
  });

  test("should select exchange filter", () => {
    const filter = "coinmate";
    const state = { core: { ...initialState, exchangeFilterId: filter } };
    expect(activeExchangeFilterIdSelector(state)).toEqual(filter);
  });

  test("should select app init state", () => {
    const state = { core: { ...initialState, init: true } };
    expect(appStateSelector(state)).toEqual(true);
  });

  test("should select sw update state", () => {
    const state = { core: { ...initialState, serviceWorkerUpdated: true } };
    expect(serviceWorkerIsUpdatedSelector(state)).toEqual(true);
  });

  test("should quote symbol", () => {
    const state = { core: { ...initialState } };
    expect(quoteSymbolSelector(state)).toEqual(DEFAULT_QUOTE_SYMBOL);
  });
});
