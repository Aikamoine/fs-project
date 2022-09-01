import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

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
    toast('Tunnisteita ei tule sekoittaa allergeenimerkintöihin! Lue reseptin tiedot tarkkaan, jos noudatat erikoisruokavaliota!')
  }, [])

  return (
    <>
      <h1>Reseptit</h1>
      <RecipeList recipes={recipes} />
    </>
  )
}
export default RecipeView
