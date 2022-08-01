import React from 'react'

import { Link } from 'react-router-dom'

const RecipeList = ({ recipes }) => {
  if (!recipes) return null

  return (
    <table>
      <tr>
        <th>Resepti</th>
        <th>Annoksia</th>
        <th>Työaika</th>
      </tr>
      {recipes.map((recipe) => (
        <tr key={recipe.id}>
          <td>
            <Link to={`/recipes/${recipe.name.replace(/-| /gi, '_').toLowerCase()}`}>
              {recipe.name}
            </Link>
          </td>
          <td>{recipe.servings}</td>
          <td>{recipe.time}</td>
        </tr>
      ))}
    </table>
  )
}

export default RecipeList
