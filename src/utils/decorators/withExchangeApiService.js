import {
  compose,
  lifecycle,
  branch,
  renderNothing,
  pure,
  withState,
  flattenProp,
  mapProps,
} from "recompose";
// @ts-ignore
import { isEmpty, omit } from "lodash/fp";
import { importExchangeApiServiceInstance } from "../asyncImportService";

/**
 * Higher-order component providing all exported functions from exchangeApiService to its children as props
 */
export default compose(
  withState("exchangeApiMethods", "setExchangeApiMethods", {}),
  lifecycle({
    async componentDidMount() {
      const exchangeApiMethods = await importExchangeApiServiceInstance();
      this.props.setExchangeApiMethods(exchangeApiMethods);
    },
  }),
  flattenProp("exchangeApiMethods"),
  // Do not render children until the module with functions is loaded
  branch(({ exchangeApiMethods }) => {
    return isEmpty(exchangeApiMethods);
  }, renderNothing),
  mapProps(omit(["setExchangeApiMethods", "exchangeApiMethods"])),
  pure
);
