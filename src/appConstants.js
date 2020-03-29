export const APP_NAME = "hodl.watch";

export const DEFAULT_QUOTE_SYMBOL = "USD";
export const QUOTE_SYMBOL_LIST = ["USD", "EUR", "GBP"];

export const DEFAULT_PROXY_URL = "https://hodlwatch-proxy.herokuapp.com/";

// timeframe 1 hour
export const TF_1H = "TF_1H";
// timeframe 1 day
export const TF_1D = "TF_1D";
// timeframe 1 week
export const TF_1W = "TF_1W";
// timeframe 1 month
export const TF_1M = "TF_1M";
// timeframe 6 months
export const TF_6M = "TF_6M";
// timeframe 1 year
export const TF_1Y = "TF_1Y";
// timeframe 1 year
export const TF_2Y = "TF_2Y";

// timeFrame constants
export const TIME_FRAMES = {
  // [TF_1H]: {
  //   id: TF_1H,
  //   name: '1H',
  //   longName: '1 hour'
  // },
  [TF_1D]: {
    id: TF_1D,
    name: "1D",
    longName: "24 hours",
    chartDateFormat: "HH:mm",
  },
  [TF_1W]: {
    id: TF_1W,
    name: "1W",
    longName: "7 days",
    chartDateFormat: "dd HH:mm",
  },
  [TF_1M]: {
    id: TF_1M,
    name: "1M",
    longName: "30 days",
    chartDateFormat: "HH:mm DD/MM/YY",
  },
  [TF_6M]: {
    id: TF_6M,
    name: "6M",
    longName: "6 months",
    chartDateFormat: "DD/MM/YY",
  },
  [TF_1Y]: {
    id: TF_1Y,
    name: "1Y",
    longName: "1 year",
    chartDateFormat: "DD/MM/YY",
  },
  [TF_2Y]: {
    id: TF_2Y,
    name: "2Y",
    longName: "2 years",
    chartDateFormat: "DD/MM/YY",
  },
};
