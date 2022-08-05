import React from 'react'

import { Link } from 'react-router-dom'

const RecipeList = ({ recipes }) => {
  if (!recipes) return null

  return (
    <table>
      <thead>
        <tr>
          <th>Resepti</th>
          <th>Annoksia</th>
          <th>Työaika</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe.id}>
            <td>
              <Link to={`/recipes/${recipe.urlName}`}>
                {recipe.name}
              </Link>
            </td>
            <td>{recipe.servings}</td>
            <td>{recipe.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RecipeList
