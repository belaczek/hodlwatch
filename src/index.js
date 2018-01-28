import React from 'react'
import ReactDOM from 'react-dom'

import { configureStore } from './store/configureStore'
// import { updateServiceWorker } from 'store/modules/core'
// import registerServiceWorker from './registerServiceWorker'
import App from './App'

import './App.css'

const store = configureStore()

// Callback passed into service worker which is called when sw receives updated content
// const onUpdate = () => {
//   store.dispatch(updateServiceWorker())
// }

ReactDOM.render(<App store={store} />, document.getElementById('root'))

// registerServiceWorker(onUpdate)
