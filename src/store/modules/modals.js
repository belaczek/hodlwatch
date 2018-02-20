// @ts-ignore
import { get } from 'lodash/fp'

// Constants
const SHOW_MODAL = 'SHOW_MODAL'
const HIDE_MODAL = 'HIDE_MODAL'

/** Initial State */
const initialState = {
  modalType: null,
  props: {}
}

/** Modal reducer */
export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        modalType: get(['payload', 'modalType'], action),
        props: get(['payload', 'props'])
      }

    case HIDE_MODAL:
      return initialState

    default:
      return state
  }
}

// Actions

export const openModal = (modalType, props) => {
  return {
    type: SHOW_MODAL,
    payload: {
      modalType,
      props
    }
  }
}

export const closeModal = () => {
  return {
    type: HIDE_MODAL
  }
}
