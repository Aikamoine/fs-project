import React from 'react'

const RecipeList = ({ recipes }) => {
  if (!recipes) return null

  console.log('recipelist', recipes)
  return (
    <table>
      <tr>
        <th>Resepti</th>
        <th>Annoksia</th>
        <th>Huom</th>
      </tr>
      {recipes.map((recipe) => (
        <tr key={recipe.id}>
          <td>{recipe.name}</td>
          <td>{recipe.servings}</td>
          <td>{recipe.notes}</td>
        </tr>
      ))}
    </table>
  )
}

export default RecipeList
