import React from 'react'
import { Route, Routes } from 'react-router-dom'

import FrontPage from 'Components/FrontPage'
import RecipeView from 'Components/RecipeView'
import SingleRecipe from 'Components/SingleRecipe'
import AddRecipe from 'Components/AddRecipe'
import CreateUser from './User/CreateUser'
import LoginForm from './User/LoginForm'
import Logout from './User/Logout'

import Shoppinglist from './Shoppinglist/index'
import ManageIngredients from './ManageIngredients/index'

// <Route path="/addtoshoppinglist/:id" element={<RecipeView />} />
export default () => (
  <div className="content">
    <Routes>
      <Route exact path="/" element={<FrontPage />} />
      <Route path="/users" element={<CreateUser />} />
      <Route path="/shoppinglist" element={<Shoppinglist />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/recipes" element={<RecipeView />} />
      <Route path="/recipes/:urlName" element={<SingleRecipe />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/addrecipe" element={<AddRecipe />} />
      <Route path="/manageingredients" element={<ManageIngredients />} />
    </Routes>
  </div>
)
