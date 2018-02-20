import {
  compose,
  lifecycle,
  branch,
  renderNothing,
  pure,
  withState,
  flattenProp,
  mapProps
} from 'recompose'
// @ts-ignore
import { isEmpty, omit } from 'lodash/fp'
import { importExchangeApiServiceInstance } from '../asyncImportService'

export default compose(
  withState('exchangeApiMethods', 'setExchangeApiMethods', {}),
  lifecycle({
    async componentDidMount () {
      const exchangeApiMethods = await importExchangeApiServiceInstance()
      this.props.setExchangeApiMethods(exchangeApiMethods)
    }
  }),
  flattenProp('exchangeApiMethods'),
  branch(({ exchangeApiMethods }) => {
    return isEmpty(exchangeApiMethods)
  }, renderNothing),
  mapProps(omit(['setExchangeApiMethods', 'exchangeApiMethods'])),
  pure
)
