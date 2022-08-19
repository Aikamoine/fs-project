import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import 'Assets/custom.scss'
import App from 'Components/App'

const container = document.getElementById('root')
const root = createRoot(container)

const refresh = () => root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

refresh()

if (module.hot) {
  module.hot.accept()
}
