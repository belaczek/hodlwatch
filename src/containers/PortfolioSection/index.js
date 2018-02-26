import React from 'react'
import { connect } from 'react-redux'
// @ts-ignore
import { map, toPairs } from 'lodash/fp'
import { Section, Container, Button } from 'bloomer'
import { compose, pure, withPropsOnChange } from 'recompose'
import { portfolioSymbolsSelector } from 'store/modules/portfolio'

import { Title } from 'bloomer/lib/elements/Title'
import { Table } from 'bloomer/lib/elements/Table'

import './index.css'
import { setSymbolFilter } from 'store/modules/core'

// TODO
const renderPortfolioSection = ({ total, handleSetFilter }) => (
  <Section className="PortfolioSection">
    <Container>
      <Title isSize={4}>Total holdings</Title>
      <Table className="PortfolioSection--table">
        <tbody>
          {total &&
            map(
              ([name, value]) => (
                <tr className="bg-light" key={name}>
                  <td className="u-textRight">{value}</td>
                  <td className="u-textBold">
                    <Button isLink onClick={() => handleSetFilter(name)}>
                      {name}
                    </Button>
                  </td>
                </tr>
              ),
              total
            )}
        </tbody>
      </Table>
    </Container>
  </Section>
)

const PortfolioSection = compose(
  connect(
    (state, { exchangeFilter: exchangeId, symbolFilter: symbol }) => ({
      total: portfolioSymbolsSelector({ exchangeId, symbol })(state)
    }),
    dispatch => ({
      handleSetFilter: id => dispatch(setSymbolFilter(id))
    })
  ),
  withPropsOnChange(['total'], ({ total }) => {
    return { total: toPairs(total) }
  }),
  pure
)

export default PortfolioSection(renderPortfolioSection)
