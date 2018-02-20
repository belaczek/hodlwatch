import React from 'react'
import { Box, Button, Title, Section } from 'bloomer'
import ModalWrapper from './ModalWrapper'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { RESET_APP_MODAL } from 'containers/ModalContainer/modalTypes'
import { openModal } from 'store/modules/modals'

const renderResetAppModalBody = ({ openResetModal }) => (
  <Box hasTextAlign="centered">
    <Title>Settings</Title>

    <Section>
      <Title isSize={4}>Import/Export Data</Title>
      <p>TODO</p>
    </Section>

    <Section>
      <Title isSize={4}>Reset App</Title>
      <Button isSize="small" isColor="danger" onClick={openResetModal}>
        RESET
      </Button>
    </Section>
  </Box>
)

export default compose(
  ModalWrapper,
  connect(null, dispatch => ({
    openResetModal: () => dispatch(openModal(RESET_APP_MODAL))
  }))
)(renderResetAppModalBody)
