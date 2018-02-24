import React from 'react'
import { Box, Button, Title, Field, Label, Control, TextArea } from 'bloomer'
import ModalWrapper from './ModalWrapper'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { RESET_APP_MODAL } from 'containers/ModalContainer/modalTypes'
import { openModal } from 'store/modules/modals'

const renderResetAppModalBody = ({ openResetModal }) => (
  <Box hasTextAlign="left">
    <Title>Settings</Title>

    <Field>
      <Label>
        <Title isSize={5}>Import/Export Data</Title>
      </Label>
      <Control>
        <TextArea placeholder={'Paste your exported settings'} />
      </Control>
    </Field>

    <Field>
      <Label>
        <Title isSize={5}>Reset App</Title>
      </Label>
      <Control>
        <Button isSize="small" isColor="danger" onClick={openResetModal}>
          RESET
        </Button>
      </Control>
    </Field>
  </Box>
)

export default compose(
  ModalWrapper,
  connect(null, dispatch => ({
    openResetModal: () => dispatch(openModal(RESET_APP_MODAL))
  }))
)(renderResetAppModalBody)
