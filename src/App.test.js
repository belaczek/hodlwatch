import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { configureStore } from './store/configureStore'

const store = configureStore()

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App store={store} />, div)
})
