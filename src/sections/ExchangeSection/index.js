import React from 'react'
// @ts-ignore
import { Section, Container, Tile, Title } from 'bloomer'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { savedExchangesListSelector } from 'store/selectors'

// TODO
const renderExchangeSection = ({ exchanges }) => (
  <Section>
    <Container>
      <Tile isSize={3}>Exchanges</Tile>
      <Tile isAncestor>
        <Tile isParent>
          {exchanges.map(exchange => (
            <Tile isChild key={exchange.id}>
              <Title isSize={5}>{exchange.name}</Title>
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
  }))
)

export default ExchangeSection(renderExchangeSection)
