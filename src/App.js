import React from 'react'
import { compose, withState, withHandlers, lifecycle } from 'recompose'
import { Provider, connect } from 'react-redux'

// import Intro from './screens/Intro/'
import Spinner from 'components/Spinner'
import { getAppState } from 'store/selectors'

// Small routing. Since we currently have only two routes, there is no need for react-router at the moment
const renderApp = ({ Screen }) => (Screen ? <Screen /> : <Spinner />)

const withStore = Component => ({ store, ...props }) => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
)

const getRoute = async isInitialized => {
  if (isInitialized) {
    const { default: ChildScreen } = await import('./screens/Main/')
    return ChildScreen
  } else {
    const { default: ChildScreen } = await import('./screens/Intro/')
    return ChildScreen
  }
}

const App = compose(
  withStore,
  connect(
    // state selectors
    state => ({
      appIsInitialized: getAppState(state)
    })
  ),
  withState('Screen', 'setScreen', null),
  withHandlers({
    loadScreen: ({ setScreen, initApp, appIsInitialized }) => async () => {
      // If the app was already initialized before, automatically load Main screen
      const route = await getRoute(appIsInitialized)
      // const { default: ChildScreen } = await import(routeSrc)
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
  })
)(renderApp)

export default App
