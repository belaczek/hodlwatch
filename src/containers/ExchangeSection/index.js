import React from 'react'
// @ts-ignore
import { Section, Container, Tile, Title } from 'bloomer'
import { compose, pure } from 'recompose'
import { connect } from 'react-redux'
import { savedExchangesListSelector } from 'store/selectors'

// TODO
const renderExchangeSection = ({ exchanges }) => (
  <Section>
    <Container>
      <Tile isSize={3}>Exchanges</Tile>
      <Tile isAncestor>
        <Tile isParent>
          {exchanges &&
            exchanges.map(({ name, id }) => (
              <Tile isChild key={id}>
                <Title isSize={4}>{name}</Title>
              </Tile>
            ))}
        </Tile>
      </Tile>
    </Container>
  </Section>
)

const ExchangeSection = compose(
  connect(state => ({
    exchanges: savedExchangesListSelector(state)
  })),
  pure
)

export default ExchangeSection(renderExchangeSection)
