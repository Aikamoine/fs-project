import React from 'react'

const RecipeHeader = ({ recipeDetails }) => {
  const { name, servings, time } = recipeDetails

  return (
    <div>
      <h2>{name}</h2>
      <div>
        {servings}
        {' annosta - työaika noin: '}
        {time}
      </div>
    </div>
  )
}

export default RecipeHeader
