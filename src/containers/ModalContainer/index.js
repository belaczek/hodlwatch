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
  DELETE_EXCHANGE_API,
  IMPORT_SETTINGS_MODAL
} from './modalTypes'
import DeleteExchangeApiModal from '../modals/DeleteExchangeApiModal'
import ImportSettingsConfirmModal from '../modals/ImportSettingsConfirmModal'

const MODAL_COMPONENTS = {
  [RESET_APP_MODAL]: ResetAppModal,
  [SETTINGS_MODAL]: SettingsModal,
  [DELETE_EXCHANGE_API]: DeleteExchangeApiModal,
  [IMPORT_SETTINGS_MODAL]: ImportSettingsConfirmModal
}

const renderModal = ({ ModalComponent, modalProps = {}, ...props }) => (
  <ModalComponent {...props} {...modalProps} />
)

/**
 * A container component which serves as a parent for all rendered modals
 */
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
