import React, { useState, useEffect } from 'react'
import { getRecipes } from 'Utilities/services/recipes'

import RecipeList from 'Components/RecipeView/RecipeList'

const RecipeView = () => {
  const [recipes, setRecipes] = useState([])

  const handleGetRecipes = async () => {
    const newRecipes = await getRecipes()
    setRecipes(newRecipes)
  }

  useEffect(() => {
    handleGetRecipes()
  }, [])

  return (
    <>
      <h1>Reseptit</h1>
      <RecipeList recipes={recipes} />
    </>
  )
}
export default RecipeView
