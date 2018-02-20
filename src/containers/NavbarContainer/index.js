import { compose, withState, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import Navbar from 'components/Navbar'
import { serviceWorkerIsUpdatedSelector } from 'store/selectors'
import { SETTINGS_MODAL } from 'containers/ModalContainer/modalTypes'
import { openModal } from 'store/modules/modals'

export default compose(
  connect(
    store => ({ showUpdate: serviceWorkerIsUpdatedSelector(store) }),
    dispatch => ({
      openSettingsModal: () => dispatch(openModal(SETTINGS_MODAL))
    })
  ),
  withState('burgerIsActive', 'setBurgerMenuActive', false),
  withHandlers({
    handleToggleBurgerMenu: ({ setBurgerMenuActive }) => () =>
      setBurgerMenuActive(state => !state),
    refresh: () => () => window.location.reload()
  })
)(Navbar)
