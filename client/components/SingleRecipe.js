import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeDetails } from 'Utilities/services/recipes'

const SingleRecipe = () => {
  const { urlName } = useParams()
  const [recipeDetails, setRecipeDetails] = useState()

  const handleGetRecipeDetails = async () => {
    console.log('handleGetRecipeDetails starts', urlName)
    const details = await getRecipeDetails(urlName)
    console.log('handleGetRecipeDetails end', details)
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

  console.log('SingleRecipe recipedetails', recipeDetails)
  return (
    <div>
      <h2>{recipeDetails.name}</h2>
      <div>
        {recipeDetails.servings}
        {' annosta, työaika noin: '}
        {recipeDetails.time}
      </div>
      <h3>Ainesosat</h3>
      <div>
        {recipeDetails.ingredients.map((ingredient) => (
          <div key={ingredient.id}>
            {ingredient.recipe_ingredients.amount}
            {' '}
            {ingredient.recipe_ingredients.unit}
            {' '}
            {ingredient.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SingleRecipe
