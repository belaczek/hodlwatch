/**
 * Asynchronously load ccxt module to reduce initial page load
 */
export const ccxt = async () => {
  const datasource = await import("ccxt");
  return datasource;
};

export default {
  ccxt
};
