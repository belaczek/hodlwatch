import React from 'react'
import { Box, Button } from 'bloomer'
import ModalWrapper from './ModalWrapper'
import { compose, withProps } from 'recompose'

const renderResetAppModalBody = ({ onSubmit, toggleModal }) => (
  <Box hasTextAlign="centered">
    <p className="u-textBold">
      Importing new settings will rewrite all current settings.
    </p>
    <p className="mb-10 u-textBold"> Are you sure you want to continue?</p>

    <Button isColor="warning" className="ml-5" onClick={onSubmit}>
      Confirm Import
    </Button>
    <Button className="is-text" onClick={toggleModal}>
      Cancel
    </Button>
  </Box>
)

export default compose(
  ModalWrapper,
  withProps(({ settingsString, toggleModal, onSubmit }) => ({
    settingsString,
    toggleModal,
    onSubmit
  }))
)(renderResetAppModalBody)
