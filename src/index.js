import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { store } from './store/Index.js'
import { Provider } from 'react-redux'

import 'antd/dist/antd.css' // antdsign css


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)


