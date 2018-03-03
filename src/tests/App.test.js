import React from 'react'
import ReactDOM from 'react-dom'
import App from '../App'
import { configureStore } from 'store/configureStore'
import { saveState } from 'utils/localStorage'

class LocalStorageMock {
  constructor () {
    this.store = {}
  }

  clear () {
    this.store = {}
  }

  getItem (key) {
    return this.store[key] || null
  }

  setItem (key, value) {
    this.store[key] = value.toString()
  }

  removeItem (key) {
    delete this.store[key]
  }
}

it('renders without crashing', () => {
  const store = configureStore()
  const div = document.createElement('div')
  ReactDOM.render(<App store={store} />, div)
})

it('renders with store data without crashing', () => {
  global.localStorage = new LocalStorageMock()

  const state = {
    core: {
      init: true
    },
    apiKeys: {
      coinmate: {}
    }
  }

  saveState(state)

  const store = configureStore()

  const div = document.createElement('div')
  ReactDOM.render(<App store={store} />, div)
})
