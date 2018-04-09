import React from 'react'
import ReactDOM from 'react-dom'
import { configureStore } from './store/configureStore'
import App from './App'
import './App.css'

/* import { updateServiceWorker } from 'store/modules/core'
import registerServiceWorker from './registerServiceWorker' */

// Create a new instance of redux store
const store = configureStore()

// Entry point of the app which renders the content of react app into 'root' element in the index.html file
ReactDOM.render(<App store={store} />, document.getElementById('root'))

/**
 * Implementation of service worker support
 * It is currently disabled because of a not-very-good support across web browsers
 * To enable it, just remove the block comment from the code below and from the corresponding import
 */

/*
// Callback passed into service worker which is called when sw receives updated content
const onUpdate = () => {
  store.dispatch(updateServiceWorker())
}

// Register service worker at compatible browser
registerServiceWorker(onUpdate)
*/
