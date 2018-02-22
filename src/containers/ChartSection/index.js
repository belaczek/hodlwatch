import React from 'react'
import { Section, Container } from 'bloomer'
import { compose } from 'recompose'
import Chart from 'components/Chart'

import './index.css'

// TODO
const renderChartSection = () => (
  <Section className="ChartSection">
    <Container className="is-widescreen">
      <Chart />
    </Container>
  </Section>
)

const ChartSection = compose()

export default ChartSection(renderChartSection)
