import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRecipeDetails } from 'Utilities/services/recipes'

import RecipeHeader from './RecipeHeader'
import IngredientView from './IngredientView'

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
      <RecipeHeader recipeDetails={recipeDetails} />
      <IngredientView ingredients={recipeDetails.ingredients} />
      <p>
        <Link to="/recipes">
          Takaisin reseptilistaan
        </Link>
      </p>
    </div>
  )
}
export default SingleRecipe
