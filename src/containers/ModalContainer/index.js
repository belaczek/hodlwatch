import React from 'react'
import { connect } from 'react-redux'
import { compose, withPropsOnChange, renderNothing, branch } from 'recompose'
import { modalTypeSelector, modalPropsSelector } from 'store/selectors'
import { closeModal } from 'store/modules/modals'

// Modal Components
import ResetAppModal from 'containers/modals/ResetAppModal'
import SettingsModal from 'containers/modals/SettingsModal'

import { RESET_APP_MODAL, SETTINGS_MODAL } from './modalTypes'

const MODAL_COMPONENTS = {
  [RESET_APP_MODAL]: ResetAppModal,
  [SETTINGS_MODAL]: SettingsModal
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
