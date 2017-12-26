import React from "react";
import { Level, LevelItem, Heading, Title } from "bloomer";

export default () => (
  <Level isMobile>
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>value</Heading>
        <Title>$ 123 567</Title>
      </div>
    </LevelItem>
  </Level>
);
