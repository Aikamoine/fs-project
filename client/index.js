import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import 'Assets/custom.scss'
import App from 'Components/App'

const refresh = () => render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
)

refresh()

if (module.hot) {
  module.hot.accept()
}
