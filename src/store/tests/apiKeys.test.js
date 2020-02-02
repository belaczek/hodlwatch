import { DEFAULT_PROXY_URL } from "appConstants";
import reducer, {
  setExchangeCredentials,
  toggleProxySettings,
  setProxyUrl,
  proxySettingsSelector,
  activeProxySelector,
  parseProxySettings,
  apiKeysSelector,
  apiKeysByIdSelector
} from "../modules/apiKeys";

const initialState = {
  useGlobalApiProxy: false,
  globalProxyUrl: DEFAULT_PROXY_URL,
  data: {}
};

test("reducer should return initial state", () => {
  const state = reducer(undefined, {});
  expect(state).toEqual(initialState);
});

describe("apiKeys actions", () => {
  test("should set api credentials", () => {
    const testCreds = {
      exchangeId: "test",
      apiKey: "1234",
      secret: "secret",
      uid: 123,
      password: "password",
      proxy: "proxy"
    };
    const state = reducer(initialState, setExchangeCredentials(testCreds));
    expect(state).toHaveProperty("data");
    expect(state.data).toHaveProperty(testCreds.exchangeId, testCreds);
  });

  test("should delete api credentials", () => {
    const exchange1 = {
      exchangeId: "exchange1",
      apiKey: 123243,
      secert: "sdgsdfg"
    };
    const exchange2 = {
      exchangeId: "exchange2",
      apiKey: 123243,
      secert: "sdgsdfg",
      proxy: "https://bla.com"
    };
    let state = reducer(initialState, setExchangeCredentials(exchange1));
    state = reducer(initialState, setExchangeCredentials(exchange2));

    state = reducer(state, {
      type: "DELETE_EXCHANGE_CREDENTIALS",
      payload: exchange1.exchangeId
    });

    expect(state.data).not.toHaveProperty(exchange1.exchangeId);
    expect(state.data).toHaveProperty(exchange2.exchangeId);
  });

  test("should toggle global proxy settings", () => {
    const state = reducer(initialState, toggleProxySettings());
    expect(state).toHaveProperty("useGlobalApiProxy", true);
  });

  test("should change global proxy url", () => {
    const proxy = "http://bla.com";
    const state = reducer(initialState, setProxyUrl(proxy));
    expect(state).toHaveProperty("globalProxyUrl", proxy);
  });
});

describe("apiKeys selectors", () => {
  const testState = {
    apiKeys: {
      useGlobalApiProxy: true,
      globalProxyUrl: DEFAULT_PROXY_URL,
      data: {
        exchange1: {
          apiKey: 1234,
          exchangeId: "bla",
          private: "private"
        },
        exchange2: {
          apiKey: 12345,
          exchangeId: "blaa",
          private: "private",
          proxy: "proxy"
        }
      }
    }
  };

  test("should select global proxy settings", () => {
    const res = proxySettingsSelector(testState);

    expect(res).toHaveProperty("useGlobalApiProxy");
    expect(res).toHaveProperty("globalProxyUrl");
  });

  test("should select active global proxy", () => {
    const res = activeProxySelector(testState);
    expect(res).toEqual(DEFAULT_PROXY_URL);
  });

  test("should return null when global proxy not enabled", () => {
    const state = {
      apiKeys: { ...testState.apiKeys, useGlobalApiProxy: false }
    };
    const res = activeProxySelector(state);
    expect(res).toBeFalsy();
  });

  test("should select active global proxy", () => {
    const res = activeProxySelector(testState);
    expect(res).toEqual(DEFAULT_PROXY_URL);
  });

  test("should parse correct proxy address", () => {
    const res = parseProxySettings(testState)(testState.apiKeys.data.exchange2);
    expect(res).toHaveProperty("proxy", "proxy");
  });

  test("should select all api Keys", () => {
    const res = apiKeysSelector(testState);
    expect(res).toEqual(testState.apiKeys.data);
  });

  test("should select apiKey by Id", () => {
    const res = apiKeysByIdSelector("exchange2")(testState);
    expect(res).toEqual(testState.apiKeys.data.exchange2);
  });
});
