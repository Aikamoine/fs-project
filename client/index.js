import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import 'Assets/custom.scss'
import App from 'Components/App'
import { GlobalState } from 'Components/GlobalState'

const refresh = () => render(
  <GlobalState>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GlobalState>,
  document.getElementById('root'),
)

refresh()

if (module.hot) {
  module.hot.accept()
}
