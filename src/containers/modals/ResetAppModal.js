import React from 'react'
import { Box, Button } from 'bloomer'
import { connect } from 'react-redux'
import ModalWrapper from './ModalWrapper'
import { resetApp } from 'store/modules/core'
import { compose } from 'recompose'

const renderResetAppModalBody = ({ handleResetApp, toggleModal }) => (
  <Box hasTextAlign="centered">
    <p className="mb-10 u-textBold">
      Are you sure you want to delete all your data? This step can not be
      undone.
    </p>
    <Button isColor="danger" onClick={handleResetApp}>
      confirm reset
    </Button>
    <Button className="is-text ml-5" onClick={toggleModal}>
      cancel
    </Button>
  </Box>
)

export default compose(
  ModalWrapper,
  connect(
    null,
    dispatch => ({
      handleResetApp: () => dispatch(resetApp())
    })
  )
)(renderResetAppModalBody)
