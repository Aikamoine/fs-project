import React from 'react'
import { Route, Routes } from 'react-router-dom'

import FrontPage from 'Components/FrontPage'
import MessageView from 'Components/MessageView'
import RecipeView from 'Components/RecipeView'

export default () => (
  <div className="content">
    <Routes>
      <Route exact path="/" element={<FrontPage />} />
      <Route path="/messages" element={<MessageView />} />
      <Route path="/recipes" element={<RecipeView />} />
    </Routes>
  </div>
)
