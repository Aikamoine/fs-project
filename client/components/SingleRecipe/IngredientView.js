import React from 'react'

const IngredientView = ({ ingredients }) => (
  <div>
    <h3>Ainesosat</h3>
    <div>
      {ingredients.map((ingredient) => (
        <div key={ingredient.id}>
          {ingredient.amount ? Number(ingredient.amount) : ''}
          {' '}
          {ingredient.unit}
          {' '}
          {ingredient.name}
        </div>
      ))}
    </div>
  </div>
)

export default IngredientView
