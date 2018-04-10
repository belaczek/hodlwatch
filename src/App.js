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

import { appStateSelector } from 'store/modules/core'
import Spinner from 'components/Spinner'
import IntroScreen from 'containers/IntroScreenContainer'
import {
  importMainAppScreen,
  prefetchAllAssets
} from 'utils/asyncImportService'

// Small routing. Since we currently have only two routes, there is no need for react-router at the moment
const renderApp = ({ Screen }) => <Screen />

/**
 * Wrap component with Provider
 * @param {*} Component - component to be wrapperd
 */
const withStore = Component => ({ store, ...props }) => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
)

/**
 * Asynchroously load component based on input props
 * @param {Boolean} isInitialized indicates whether or not the app was already initialize
 */
const getRoute = async isInitialized => {
  if (isInitialized) {
    const MainAppScreen = await importMainAppScreen()
    return MainAppScreen
  }
  return IntroScreen
}

const App = compose(
  withStore,
  connect(
    // state selectors
    state => ({
      appIsInitialized: appStateSelector(state)
    })
  ),
  // A state which contains a child component to be rendered
  withState('Screen', 'setScreen', null),
  withHandlers({
    /**
     * Load and set child component based on the state.
     * If app is initialized, show MainApp screen
     * If it is not initialized, show Intro screen
     */
    loadScreen: ({ setScreen, appIsInitialized }) => async () => {
      // If the app was already initialized before, automatically load Main screen
      const route = await getRoute(appIsInitialized)
      setScreen(() => route)
    }
  }),
  lifecycle({
    componentWillMount () {
      /**
       * When the App is mounted, load child screen
       */
      this.props.loadScreen()
    },
    componentDidMount () {
      /**
       * After initial page load prefetch all remaining assets
       */
      prefetchAllAssets()
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
