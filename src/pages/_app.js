import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import withStore from 'utils/decorators/withStore'

class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default withStore(MyApp)
