import React from 'react'
import ReactDOM from 'react-dom'

import { configureStore } from './store/configureStore'
import App from './App'
import './App.css'

/* Do not use service worker for now */
// import registerServiceWorker from './registerServiceWorker';

const store = configureStore()

ReactDOM.render(<App store={store} />, document.getElementById('root'))

// registerServiceWorker();
