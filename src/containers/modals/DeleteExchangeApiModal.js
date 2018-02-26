import React from 'react'
import { Box, Button } from 'bloomer'
import ModalWrapper from './ModalWrapper'
import { compose } from 'recompose'

const renderDeleteExchangeApiBody = ({
  onSubmit,
  exchangeName,
  toggleModal
}) => (
  <Box hasTextAlign="centered">
    <p className="mb-10 u-textBold">
      Are you sure you want to delete <strong>{exchangeName}</strong> with all
      its data?
    </p>
    <Button isColor="danger" onClick={onSubmit}>
      Delete
    </Button>
    <Button className="is-text" onClick={toggleModal}>
      Cancel
    </Button>
  </Box>
)

export default compose(ModalWrapper)(renderDeleteExchangeApiBody)
