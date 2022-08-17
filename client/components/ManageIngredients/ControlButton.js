import React from 'react'
import Button from 'react-bootstrap/Button'

const ControlButton = ({
  ingredient,
  handleRemove,
  handleReplace,
  handleDelete,
  handleAddIngredient,
}) => {
  if (ingredient.id <= 0) {
    return (
      <>
        <Button variant="danger" size="sm" onClick={(event) => handleRemove(event, ingredient.id)}>Peru lisäys</Button>
        {'    '}
        { ingredient.name && <Button size="sm" onClick={(event) => handleAddIngredient(event, ingredient)}>Lisää ainesosa</Button>}
      </>
    )
  }

  if (!ingredient.name) {
    return null
  }

  if (Number(ingredient.count) === 0 && !ingredient.edited) {
    return (
      <Button size="sm" onClick={(event) => handleDelete(event, ingredient)}>Poista kokonaan</Button>
    )
  }

  if (!ingredient.edited) {
    return null
  }

  if (Number(ingredient.count) === 0) {
    return (
      <>
        <Button variant="warning" size="sm" onClick={(event) => handleReplace(event, ingredient)}>Päivitä</Button>
        <Button variant="danger" size="sm" onClick={(event) => handleDelete(event, ingredient)}>Poista kokonaan</Button>
      </>
    )
  }
  return (
    <Button variant="warning" size="sm" onClick={(event) => handleReplace(event, ingredient)}>Päivitä</Button>
  )
}

export default ControlButton
