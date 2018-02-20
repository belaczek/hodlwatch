import React from 'react'
import { Footer, Container, Content, Button } from 'bloomer'
import { compose } from 'recompose'

import { appName } from 'appConstants'

const renderFooter = ({
  isInit,
  handleResetApp,
  modalIsActive,
  openResetModal
}) => (
  <Footer>
    <Container>
      <Content hasTextAlign="centered">
        <p>
          <strong>{appName}</strong> by{' '}
          <a href="https://tomasbelada.com">Tomas Belada</a>. The source code is
          licensed{' '}
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
        {isInit && (
          <Button isSize="small" isColor="danger" onClick={openResetModal}>
            RESET
          </Button>
        )}
      </Content>
    </Container>
  </Footer>
)

export default compose()(renderFooter)
