import {
  Button,
  Container,
  Hero,
  HeroBody,
  HeroFooter,
  Subtitle,
  Title
} from 'bloomer'
import { compose, withHandlers, withState } from 'recompose'
import { connect } from 'react-redux'
import React from 'react'

import { appName } from 'appConstants'
import { setAppInitialized } from 'store/modules/core'

const renderIntro = ({ handleBtnClick, btnIsLoading }) => (
  <Hero isFullHeight isColor="light">
    <HeroBody>
      <Container hasTextAlign="centered">
        <Title isSize={1}>{appName}</Title>
        <Subtitle>cryptocurrency portfolio tracking app</Subtitle>
        <Button
          isColor="warning"
          onClick={handleBtnClick}
          isLoading={btnIsLoading}
        >
          OPEN
        </Button>
        <p className="is-size-5 mt-10">under heavy development</p>
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

/**
 * Intro screen which is displayed the first time user visits the page
 */
const Intro = compose(
  connect(null, dispatch => ({
    setAppInitialized: () => dispatch(setAppInitialized())
  })),
  withState('btnIsLoading', 'setBtnLoading', false),
  withHandlers({
    handleBtnClick: ({ setBtnLoading, loadApp, setAppInitialized }) => () => {
      setBtnLoading(true)
      setAppInitialized()
    }
  })
)(renderIntro)

export default Intro
