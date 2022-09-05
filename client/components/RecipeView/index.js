import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { useGlobalState } from 'Components/hooks/GlobalState'
import { getRecipes } from 'Utilities/services/recipes'
import RecipeList from 'Components/RecipeView/RecipeList'

const RecipeView = () => {
  const [recipes, setRecipes] = useState([])
  const [globalState, updateGlobalState] = useGlobalState()

  const handleGetRecipes = async () => {
    const newRecipes = await getRecipes()
    setRecipes(newRecipes)
  }

  useEffect(() => {
    handleGetRecipes()
    if (!globalState.allergenWarningShown) {
      toast('Tunnisteita ei tule sekoittaa allergeenimerkintöihin! Lue reseptin tiedot tarkkaan, jos noudatat erikoisruokavaliota!')
      updateGlobalState({ allergenWarningShown: true })
    }
  }, [])

  return (
    <>
      <h1>Reseptit</h1>
      <RecipeList recipes={recipes} />
    </>
  )
}
export default RecipeView
