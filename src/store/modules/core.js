import { clearStorage } from 'utils/localStorage'

// Action constants
const INIT_APP = 'INIT_APP'
const UPDATE_SERVICE_WORKER = 'UPDATE_SERVICE_WORKER'

const initialState = {
  init: false,
  serviceWorkerUpdated: false
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INIT_APP: {
      return { ...state, init: true }
    }

    case UPDATE_SERVICE_WORKER: {
      return {
        ...state,
        serviceWorkerUpdated: true
      }
    }

    default:
      return state
  }
}

// Action creators

export const setAppInitialized = () => ({ type: INIT_APP })

export const updateServiceWorker = () => ({ type: UPDATE_SERVICE_WORKER })

export const resetApp = () => dispatch => {
  clearStorage()
  window.location.reload()
}
