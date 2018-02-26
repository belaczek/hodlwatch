import React from 'react'
import { connect } from 'react-redux'
import { compose, withPropsOnChange, renderNothing, branch } from 'recompose'
import {
  closeModal,
  modalTypeSelector,
  modalPropsSelector
} from 'store/modules/modals'

// Modal Components
import ResetAppModal from 'containers/modals/ResetAppModal'
import SettingsModal from 'containers/modals/SettingsModal'

import {
  RESET_APP_MODAL,
  SETTINGS_MODAL,
  DELETE_EXCHANGE_API
} from './modalTypes'
import DeleteExchangeApiModal from '../modals/DeleteExchangeApiModal'

const MODAL_COMPONENTS = {
  [RESET_APP_MODAL]: ResetAppModal,
  [SETTINGS_MODAL]: SettingsModal,
  [DELETE_EXCHANGE_API]: DeleteExchangeApiModal
}

const renderModal = ({ ModalComponent, modalProps = {}, ...props }) => (
  <ModalComponent {...props} {...modalProps} />
)

export default compose(
  connect(
    state => ({
      modalType: modalTypeSelector(state),
      modalProps: modalPropsSelector(state)
    }),
    dispatch => ({
      closeModal: () => dispatch(closeModal())
    })
  ),
  withPropsOnChange(['modalType'], ({ modalType }) => ({
    ModalComponent: MODAL_COMPONENTS[modalType],
    isActive: true
  })),
  branch(({ ModalComponent }) => !ModalComponent, renderNothing)
)(renderModal)
