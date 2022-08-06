import React from 'react'

const RecipeHeader = ({ name, servings, time }) => (
  <div>
    <h2>{name}</h2>
    <div>
      {servings}
      {' annosta - työaika noin: '}
      {time}
    </div>
  </div>
)

export default RecipeHeader
