import { compose, withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import Navbar from "components/Navbar";
import {
  serviceWorkerIsUpdatedSelector,
  resetFilters,
  activeFilterSelector,
} from "store/modules/core";
import { SETTINGS_MODAL } from "containers/ModalContainer/modalTypes";
import { openModal } from "store/modules/modals";

export default compose(
  connect(
    (store) => ({
      showUpdate: serviceWorkerIsUpdatedSelector(store),
      isActiveFilter: activeFilterSelector(store),
    }),
    (dispatch) => ({
      openSettingsModal: () => dispatch(openModal(SETTINGS_MODAL)),
      handleResetFilter: () => dispatch(resetFilters()),
    })
  ),
  withState("burgerIsActive", "setBurgerMenuActive", false),
  withHandlers({
    handleToggleBurgerMenu: ({ setBurgerMenuActive }) => () =>
      setBurgerMenuActive((state) => !state),
    refresh: () => () => window.location.reload(),
  })
)(Navbar);
