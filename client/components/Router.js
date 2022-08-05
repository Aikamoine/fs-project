import React from 'react'
import { Route, Routes } from 'react-router-dom'

import FrontPage from 'Components/FrontPage'
import MessageView from 'Components/MessageView'
import RecipeView from 'Components/RecipeView'
import SingleRecipe from 'Components/SingleRecipe'
import CreateUser from './User/CreateUser'
import LoginForm from './User/LoginForm'
import Logout from './User/Logout'
import AddRecipe from './AddRecipe/index'

export default () => (
  <div className="content">
    <Routes>
      <Route exact path="/" element={<FrontPage />} />
      <Route path="/messages" element={<MessageView />} />
      <Route path="/users" element={<CreateUser />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/recipes" element={<RecipeView />} />
      <Route path="/recipes/:urlName" element={<SingleRecipe />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/addrecipe" element={<AddRecipe />} />
    </Routes>
  </div>
)
