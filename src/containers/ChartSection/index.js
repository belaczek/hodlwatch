import React from 'react'
import { Section, Container } from 'bloomer'
import { compose } from 'recompose'
import Chart from 'components/Chart'

// TODO
const renderChartSection = () => (
  <Section>
    <Container>
      <Chart />
    </Container>
  </Section>
)

const ChartSection = compose()

export default ChartSection(renderChartSection)
