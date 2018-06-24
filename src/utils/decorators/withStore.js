import React from 'react'
import { configureStore } from 'store/configureStore'

const isServer = typeof window === 'undefined'
const __REDUX_STORE__ = '__REDUX_STORE__'

function getOrCreateStore (initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return configureStore(initialState)
  }

  // Store in global variable if client
  if (!window[__REDUX_STORE__]) {
    window[__REDUX_STORE__] = configureStore(initialState)
  }
  return window[__REDUX_STORE__]
}

export default App => {
  return class Redux extends React.Component {
    static async getInitialProps (appContext) {
      const reduxStore = getOrCreateStore()

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState()
      }
    }

    constructor (props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render () {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
