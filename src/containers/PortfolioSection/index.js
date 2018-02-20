import React from 'react'
import { connect } from 'react-redux'
// @ts-ignore
import { map, toPairs } from 'lodash/fp'
import { Section, Container } from 'bloomer'
import { compose, withProps, pure, withPropsOnChange } from 'recompose'
import {
  totalSumPortfolioSelector,
  allPortfolioDataSelector
} from 'store/selectors'
import { Title } from 'bloomer/lib/elements/Title'
import { Table } from 'bloomer/lib/elements/Table'

import './index.css'

// TODO
const renderPortfolioSection = ({ total }) => (
  <Section className="PortfolioSection">
    <Container>
      <Title isSize={4}>Total holdings</Title>
      <Table className="PortfolioSection--table">
        {total &&
          map(
            ([name, value]) => (
              <tr className="bg-light">
                <td className="bg-light u-textRight"> {value}</td>{' '}
                <td className="u-textBold">{name}</td>
              </tr>
            ),
            total
          )}
      </Table>
    </Container>
  </Section>
)

const PortfolioSection = compose(
  connect(state => ({
    total: totalSumPortfolioSelector(state),
    allData: allPortfolioDataSelector(state)
  })),
  withPropsOnChange(['total'], ({ total }) => {
    return { total: toPairs(total) }
  }),
  pure
)

export default PortfolioSection(renderPortfolioSection)
