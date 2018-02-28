import React from 'react'
import { Box, Button } from 'bloomer'
import ModalWrapper from './ModalWrapper'
import { compose, withHandlers } from 'recompose'

const renderDeleteExchangeApiBody = ({
  handleSubmit,
  exchangeName,
  toggleModal
}) => (
  <Box hasTextAlign="centered">
    <p className="mb-10 u-textBold">
      Are you sure you want to delete <strong>{exchangeName}</strong> with all
      its data?
    </p>
    <Button isColor="danger" onClick={handleSubmit}>
      Delete
    </Button>
    <Button className="is-text" onClick={toggleModal}>
      Cancel
    </Button>
  </Box>
)

export default compose(
  ModalWrapper,
  withHandlers({
    handleSubmit: ({ toggleModal, onSubmit }) => () => {
      onSubmit()
      toggleModal()
    }
  })
)(renderDeleteExchangeApiBody)
