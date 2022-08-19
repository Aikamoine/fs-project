import React from 'react'
// import { render } from 'react-dom'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import 'Assets/custom.scss'
import App from 'Components/App'

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

/*
const refresh = () => render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
)
*/

refresh()

if (module.hot) {
  module.hot.accept()
}
