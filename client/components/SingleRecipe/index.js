import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { getRecipeDetails } from 'Utilities/services/recipes'
import { addToList } from 'Utilities/services/shoppinglists'

import RecipeHeader from './RecipeHeader'
import IngredientView from './IngredientView'
import StepsView from './StepsView'

const SingleRecipe = () => {
  const { urlName } = useParams()
  const [recipeDetails, setRecipeDetails] = useState()
  const navigate = useNavigate()

  const handleGetRecipeDetails = async () => {
    const details = await getRecipeDetails(urlName)
    setRecipeDetails(details)
  }

  useEffect(() => {
    handleGetRecipeDetails()
  }, [])

  if (!recipeDetails) {
    return (
      <div>ladataan...</div>
    )
  }

  const addToShoppinglist = async (event) => {
    event.preventDefault()
    navigate('/recipes', { replace: true })
    await addToList({
      ingredients: recipeDetails.ingredients,
      id: recipeDetails.recipe.id,
      servings: recipeDetails.recipe.servings,
    })
  }

  return (
    <div>
      <RecipeHeader name={recipeDetails.recipe.name} servings={recipeDetails.recipe.servings} time={recipeDetails.recipe.time} />
      <IngredientView ingredients={recipeDetails.ingredients} />
      <StepsView steps={recipeDetails.recipe.recipe_steps} />
      <p>
        <Button type="submit" onClick={addToShoppinglist}>
          Lisää ostoslistalle
        </Button>
      </p>
      <p>
        <Link to="/recipes">
          Takaisin reseptilistaan
        </Link>
      </p>
    </div>
  )
}
export default SingleRecipe
