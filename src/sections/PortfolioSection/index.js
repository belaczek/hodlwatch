import React from 'react'
import { connect } from 'react-redux'
// @ts-ignore
import { map, toPairs } from 'lodash/fp'
import { Section, Container } from 'bloomer'
import { compose, withProps } from 'recompose'
import {
  totalSumPortfolioSelector,
  allPortfolioDataSelector
} from 'store/selectors'
import { Title } from 'bloomer/lib/elements/Title'

// TODO
const renderPortfolioSection = ({ total }) => (
  <Section>
    <Container>
      <Title isSize={4}>Total holdings</Title>
      {total &&
        map(
          ([name, value]) => (
            <p>
              {name}: {value}
            </p>
          ),
          total
        )}
    </Container>
  </Section>
)

const PortfolioSection = compose(
  connect(state => ({
    total: totalSumPortfolioSelector(state),
    allData: allPortfolioDataSelector(state)
  })),
  withProps(({ total }) => {
    console.log(total)
    return { total: toPairs(total) }
  })
)

export default PortfolioSection(renderPortfolioSection)
