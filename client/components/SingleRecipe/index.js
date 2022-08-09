import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
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
    toast(`Lisätään ${recipeDetails.recipe.name} ostoslistalle. Kaikkien tuotteiden näkymisessä saattaa mennä pieni hetki`)
    await addToList({
      ingredients: recipeDetails.ingredients,
      id: recipeDetails.recipe.id,
      servings: recipeDetails.recipe.servings,
    })
  }

  return (
    <div>
      <RecipeHeader name={recipeDetails.recipe.name} servings={recipeDetails.recipe.servings} time={recipeDetails.recipe.time} />
      <br />
      <IngredientView ingredients={recipeDetails.ingredients} />
      <br />
      <StepsView steps={recipeDetails.recipe.recipe_steps} />
      <br />
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
