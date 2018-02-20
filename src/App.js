import React from 'react'
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  branch,
  renderComponent
} from 'recompose'
import { Provider, connect } from 'react-redux'
// @ts-ignore
import { isEmpty } from 'lodash/fp'

import { appStateSelector } from 'store/selectors'
import Spinner from 'components/Spinner'
// Small routing. Since we currently have only two routes, there is no need for react-router at the moment
const renderApp = ({ Screen }) => <Screen />

const withStore = Component => ({ store, ...props }) => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
)

const getRoute = async isInitialized => {
  if (isInitialized) {
    const { default: ChildScreen } = await import('./containers/MainScreen/')
    return ChildScreen
  } else {
    const { default: ChildScreen } = await import('./containers/IntroScreen/')
    return ChildScreen
  }
}

const App = compose(
  withStore,
  connect(
    // state selectors
    state => ({
      appIsInitialized: appStateSelector(state)
    })
  ),
  withState('Screen', 'setScreen', null),
  withHandlers({
    loadScreen: ({ setScreen, initApp, appIsInitialized }) => async () => {
      // If the app was already initialized before, automatically load Main screen
      const route = await getRoute(appIsInitialized)
      setScreen(() => route)
    }
  }),
  lifecycle({
    componentWillMount () {
      this.props.loadScreen()
    },
    componentWillReceiveProps (nextProps) {
      const { loadScreen, appIsInitialized } = this.props
      if (nextProps.appIsInitialized !== appIsInitialized) {
        loadScreen()
      }
    }
  }),
  branch(({ Screen }) => isEmpty(Screen), renderComponent(Spinner))
)(renderApp)

export default App
