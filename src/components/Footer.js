import React from 'react'
import { appName } from '../constants'
import { Footer, Container, Content } from 'bloomer'

export default () => (
  <Footer>
    <Container>
      <Content hasTextAlign='centered'>
        <p>
          <strong>{appName}</strong> by{' '}
          <a href='https://tomasbelada.com'>Tomas Belada</a>. The source code is
          licensed{' '}
          <a href='http://opensource.org/licenses/mit-license.php'>MIT</a>.
        </p>
      </Content>
    </Container>
  </Footer>
)
