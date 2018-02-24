import React from 'react'
import { Level, LevelItem, Heading, Title } from 'bloomer'

export default ({ detailTitle = 'Portfolio' }) => (
  <Level>
    {/* <LevelItem hasTextAlign="centered">
      <div>
        <Title isSize={4}>{detailTitle}</Title>
      </div>
    </LevelItem> */}
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>Market Value</Heading>
        <Title isSize={4}>$ 123 567</Title>
      </div>
    </LevelItem>
    <LevelItem hasTextAlign="centered">
      <div>
        <Heading>Daily change</Heading>
        <Title isSize={5} hasTextColor="success">
          +100 % (+$6000)
        </Title>
      </div>
    </LevelItem>
  </Level>
)
