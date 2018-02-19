import React from 'react'
import {
  Footer,
  Container,
  Content,
  Button,
  Box,
  Modal,
  ModalContent,
  ModalClose,
  ModalBackground
} from 'bloomer'
import { compose, withState } from 'recompose'
import { connect } from 'react-redux'

import { resetApp } from 'store/modules/core'
import { appName } from 'appConstants'
import { appStateSelector } from 'store/selectors'

const renderFooter = ({
  isInit,
  handleResetApp,
  modalIsActive,
  toggleModal
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
          <Button
            isSize="small"
            isColor="danger"
            onClick={() => toggleModal(true)}
          >
            RESET
          </Button>
        )}
      </Content>
    </Container>
    <Modal isActive={modalIsActive}>
      <ModalBackground onClick={() => toggleModal(false)} />
      <ModalContent>
        <Box hasTextAlign="centered">
          <p className="mb-10">
            Are you sure you want to delete all your data? This step can not be
            undone.
          </p>
          <Button isColor="danger" onClick={handleResetApp}>
            Confirm reset
          </Button>
        </Box>
      </ModalContent>
      <ModalClose onClick={() => toggleModal(false)} />
    </Modal>
  </Footer>
)

export default compose(
  connect(
    store => ({ isInit: appStateSelector(store) }),
    dispatch => ({
      handleResetApp: () => dispatch(resetApp())
    })
  ),
  withState('modalIsActive', 'toggleModal', false)
)(renderFooter)
