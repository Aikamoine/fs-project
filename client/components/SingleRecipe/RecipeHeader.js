import React from 'react'

const RecipeHeader = ({
  name,
  servings,
  time,
  info,
}) => (
  <div>
    <h2>{name}</h2>
    <div>
      {servings}
      {' annosta - työaika noin: '}
      {time}
    </div>
    <br />
    <div>
      {info}
    </div>
  </div>
)

export default RecipeHeader
