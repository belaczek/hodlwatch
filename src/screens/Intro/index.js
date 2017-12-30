import { Button, Container, Hero, HeroBody, Subtitle, Title } from 'bloomer'
import { compose, withHandlers, withState } from 'recompose'
import React from 'react'
import { appName } from '../../constants'

const renderIntro = ({ handleBtnClick, btnIsLoading }) => (
  <Hero isFullHeight isColor='light'>
    <HeroBody>
      <Container hasTextAlign='centered'>
        <Title isSize={1}>{appName}</Title>
        <Subtitle>crypto portfolio tracking app</Subtitle>
        <Button
          isColor='warning'
          onClick={handleBtnClick}
          isLoading={btnIsLoading}
        >
          OPEN
        </Button>
        <p className='is-size-5 mt-10'>under heavy development</p>
      </Container>
    </HeroBody>
  </Hero>
)

const Intro = compose(
  withState('btnIsLoading', 'setBtnLoading', false),
  withHandlers({
    handleBtnClick: ({ setBtnLoading, loadApp }) => () => {
      setBtnLoading(true)
      loadApp()
    }
  })
)(renderIntro)

export default Intro
