import reducer, {
  exchangesDataSelector,
  exchangesListSelector,
  exchangeByIdSelector
} from "../modules/exchanges";

const initialState = {
  lastUpdated: null,
  loading: false,
  error: false,
  data: []
};

test("reducer should return initial state", () => {
  const state = reducer(undefined, {});
  expect(state).toEqual(initialState);
});

describe("exchanges actions", () => {
  test("should set loading state", () => {
    const state = reducer(initialState, { type: "EXCHANGES_LOADING" });
    expect(state).toHaveProperty("loading", true);
  });

  test("should set an error", () => {
    const state = reducer(initialState, {
      type: "EXCHANGES_FAILURE",
      payload: { error: "test" }
    });
    expect(state).toHaveProperty("error", "test");
  });

  test("should set exchanges data", () => {
    const exchangesList = [
      { name: "CoinMate", id: "coinmate" },
      { name: "Bittrex", id: "bittrex" }
    ];
    const state = reducer(initialState, {
      type: "EXCHANGES_SUCCESS",
      payload: { exchangesList }
    });
    expect(state).toHaveProperty("data", exchangesList);
  });
});

describe("exchanges selectors", () => {
  const exchangesList = [
    { name: "CoinMate", id: "coinmate" },
    { name: "Bittrex", id: "bittrex" }
  ];

  const testState = {
    exchanges: {
      loading: false,
      error: "testerror",
      data: exchangesList
    }
  };

  test("should select whole exchanges module", () => {
    const res = exchangesDataSelector(testState);
    expect(res).toEqual(testState.exchanges);
  });

  test("should select list of exchanges", () => {
    const res = exchangesListSelector(testState);
    expect(res).toEqual(exchangesList);
  });

  test("should select exchange by id", () => {
    const res = exchangeByIdSelector("bittrex")(testState);
    expect(res).toEqual(exchangesList[1]);
  });
});
