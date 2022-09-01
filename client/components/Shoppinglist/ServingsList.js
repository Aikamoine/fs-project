import React from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const ServingsList = ({ recipes, handleRemoveRecipe }) => (
  <Table>
    <thead>
      <tr>
        <td>Resepti</td>
        <td>Ruoka-annoksia</td>
        <td>Muita annoksia</td>
        <td />
      </tr>
    </thead>
    <tbody>
      {recipes.map((recipe, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <tr key={`${recipe.recipe.name}${index}`}>
          <td>{recipe.recipe.name}</td>
          {recipe.recipe.tags.some((tag) => !tag.countServings)
            ? <><td /><td>{recipe.recipe.servings}</td></>
            : <><td>{recipe.recipe.servings}</td><td /></>}
          <td><Button size="sm" onClick={() => handleRemoveRecipe(recipe)}>Poista</Button></td>
        </tr>
      ))}
      <tr>
        <td>Yhteensä</td>
        <td>{recipes.reduce((total, current) => total + (current.recipe.tags.some((tag) => !tag.countServings) ? 0 : current.recipe.servings), 0)}</td>
        <td>{recipes.reduce((total, current) => total + (current.recipe.tags.some((tag) => !tag.countServings) ? current.recipe.servings : 0), 0)}</td>
      </tr>
    </tbody>
  </Table>
)

export default ServingsList
