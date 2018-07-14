import React from 'react'
import { compose, withHandlers, withState } from 'recompose'
import {
  Button,
  Container,
  Hero,
  HeroBody,
  HeroFooter,
  Subtitle,
  Title
} from 'bloomer'
import Router from 'next/router'
import { connect } from 'react-redux'
import { APP_NAME } from 'appConstants'

import { appStateSelector, setAppInitialized } from 'store/modules/core'
import 'styles/app.sass'
// import Redirect from 'components/Redirect'

const IndexScreen = ({ handleLoadApp, btnIsLoading }) => (
  <Hero isFullHeight isColor="light">
    <HeroBody>
      <Container hasTextAlign="centered">
        <Title isSize={1}>{APP_NAME}</Title>
        <Subtitle>cryptocurrency portfolio tracking app</Subtitle>
        <Button
          isColor="success"
          onClick={handleLoadApp}
          isLoading={btnIsLoading}
        >
          start using
        </Button>
      </Container>
    </HeroBody>
    <HeroFooter>
      <Container hasTextAlign="centered">
        <span>
          hodl.watch uses browsers local storage to ensure its functionality
        </span>
      </Container>
    </HeroFooter>
  </Hero>
)

const Intro = props => (
  <React.Fragment>
    {/* {props.appIsInitialized ? (
      <Redirect to="/app" as="/" replace />
    ) : ( */}
    <IndexScreen {...props} />
    {/* )} */}
  </React.Fragment>
)

const App = compose(
  connect(
    state => ({
      // Get info abou app init state
      appIsInitialized: appStateSelector(state)
    }),
    dispatch => ({
      // Set app initialized
      setAppInitialized: () => dispatch(setAppInitialized())
    })
  ),
  withState('btnIsLoading', 'setBtnLoading', false),
  withHandlers({
    /**
     * Initialize app and redirect to app screen
     */
    handleLoadApp: ({ setAppInitialized, setBtnLoading }) => () => {
      setBtnLoading(true)
      setAppInitialized()
      Router.push('/app')
    }
  })
)(Intro)

export default App
