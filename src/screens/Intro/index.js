import React from "react";
import { compose, withState, withHandlers } from "recompose";
import { appName } from "../../constants";
import { Hero, HeroBody, Container, Title, Subtitle, Button } from "bloomer";

const renderIntro = ({ handleBtnClick, btnIsLoading }) => (
  <Hero isFullHeight isColor="light">
    <HeroBody>
      <Container hasTextAlign="centered">
        <Title isSize={1}>{appName}</Title>
        <Subtitle>crypto portfolio tracking app</Subtitle>
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
  </Hero>
);

const Intro = compose(
  withState("btnIsLoading", "setBtnLoading", false),
  withHandlers({
    handleBtnClick: ({ setBtnLoading, loadApp }) => () => {
      setBtnLoading(true);
      loadApp();
    }
  })
)(renderIntro);

export default Intro;
