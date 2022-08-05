import React from 'react'

const IngredientView = ({ ingredients }) => (
  <div>
    <h3>Ainesosat</h3>
    <div>
      {ingredients.map((ingredient) => (
        <div key={ingredient.id}>
          {ingredient.recipe_ingredients.amount ? Number(ingredient.recipe_ingredients.amount) : ''}
          {' '}
          {ingredient.recipe_ingredients.unit}
          {' '}
          {ingredient.name}
        </div>
      ))}
    </div>
  </div>
)

export default IngredientView
