import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRecipeDetails } from 'Utilities/services/recipes'

import RecipeHeader from './RecipeHeader'
import IngredientView from './IngredientView'
import StepsView from './StepsView'

const SingleRecipe = () => {
  const { urlName } = useParams()
  const [recipeDetails, setRecipeDetails] = useState()

  const handleGetRecipeDetails = async () => {
    const details = await getRecipeDetails(urlName)
    setRecipeDetails(details)
  }

  useEffect(() => {
    handleGetRecipeDetails()
  }, [])

  if (!recipeDetails) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <div>
      <RecipeHeader name={recipeDetails.recipe.name} servings={recipeDetails.recipe.servings} time={recipeDetails.recipe.time} />
      <IngredientView ingredients={recipeDetails.ingredients} />
      <StepsView steps={recipeDetails.recipe.recipe_steps} />
      <p>
        <Link to="/recipes">
          Takaisin reseptilistaan
        </Link>
      </p>
    </div>
  )
}
export default SingleRecipe
