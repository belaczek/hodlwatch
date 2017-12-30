import { clearStorage } from 'utils/localStorage'

// Actions
const INIT_APP = 'INIT_APP'
export const setAppInitialized = () => ({ type: INIT_APP })
const UPDATE_SERVICE_WORKER = 'UPDATE_SERVICE_WORKER'
export const updateServiceWorker = () => ({ type: UPDATE_SERVICE_WORKER })

const initialState = {
  isAppInitialized: false,
  serviceWorkerUpdated: false
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INIT_APP: {
      return { ...state, isAppInitialized: true }
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
export const resetApp = () => dispatch => {
  clearStorage()
  window.location.reload()
}
