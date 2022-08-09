import React, { useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const IngredientTable = ({ ingredients }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Määrä</th>
        <th>Yksikkö</th>
        <th>Ainesosa</th>
      </tr>
    </thead>
    <tbody>
      {ingredients.map((ingredient) => (
        <tr key={ingredient.name + ingredient.amount}>
          <td>{ingredient.amount}</td>
          <td>{ingredient.unit}</td>
          <td>{ingredient.name}</td>
        </tr>
      ))}
    </tbody>
  </Table>
)

const IngredientList = ({ ingredients }) => (
  <>
    {ingredients.map((ingredient) => (
      <div key={ingredient.id}>
        {ingredient.amount ? Number(ingredient.amount) : ''}
        {' '}
        {ingredient.unit}
        {' '}
        {ingredient.name}
      </div>
    ))}
  </>
)

const IngredientView = ({ ingredients }) => {
  const [showAsTable, setShowAsTable] = useState(false)
  return (
    <div>
      <h3>Ainesosat{'  '}
        <Button onClick={() => setShowAsTable(!showAsTable)}>
          {showAsTable ? <>Näytä yksinkertaisena listana</> : <>Näytä taulukkona</>}
        </Button>
      </h3>
      {showAsTable ? <IngredientTable ingredients={ingredients} /> : <IngredientList ingredients={ingredients} />}
    </div>
  )
}
export default IngredientView
