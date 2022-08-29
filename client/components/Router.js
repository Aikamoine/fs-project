import React from 'react'
import { Route, Routes } from 'react-router-dom'

import FrontPage from 'Components/FrontPage'
import RecipeView from 'Components/RecipeView'
import SingleRecipe from 'Components/SingleRecipe'
import AddRecipe from 'Components/AddRecipe'
import ViewIngredients from 'Components/ViewIngredients'
import ManageTags from 'Components/ManageTags'
import Shoppinglist from 'Components/Shoppinglist'
import ManageIngredients from 'Components/ManageIngredients'
import CreateUser from './User/CreateUser'
import LoginForm from './User/LoginForm'
import Logout from './User/Logout'

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
      <Route path="/ingredients" element={<ViewIngredients />} />
      <Route path="/tags/manage" element={<ManageTags />} />
    </Routes>
  </div>
)
