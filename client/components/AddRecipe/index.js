import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

import CheckView from './CheckView'

const splitOneIngredient = (ingredient) => {
  const split = ingredient.split(' ')

  if (split.length === 1) {
    return { name: split[0].replace('_', ' '), amount: null, unit: null }
  }
  if (split.length === 2) {
    return { name: split[1].replace('_', ' '), amount: 1, unit: split[0] }
  }
  const firstIndex = ingredient.indexOf(' ')
  const secondIndex = ingredient.indexOf(' ', firstIndex + 1)

  return ({
    name: ingredient.substring(secondIndex + 1).replace('_', ' '),
    amount: ingredient.substring(0, firstIndex).replace(',', '.'),
    unit: ingredient.substring(firstIndex + 1, secondIndex),
  })
}

const formatIngredients = (ingredients) => {
  const split = ingredients.split('\n')
  const splitIngredients = split.map((i) => splitOneIngredient(i))
  return splitIngredients
}

const AddRecipe = () => {
  const [name, setName] = useState('')
  const [servings, setServings] = useState(0)
  const [time, setTime] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [postCheck, setPostCheck] = useState(false)

  const handleCheck = async (event) => {
    event.preventDefault()
    setPostCheck(true)
  }

  const nameChange = ({ target }) => setName(target.value)
  const servingsChange = ({ target }) => setServings(target.value)
  const timeChange = ({ target }) => setTime(target.value)
  const ingredientsChange = ({ target }) => setIngredients(target.value)
  const stepsChange = ({ target }) => setSteps(target.value)

  return (
    <div>
      <Form onSubmit={handleCheck}>
        <Form.Group controlId="recipe-name">
          <Form.Label>Reseptin nimi:</Form.Label>
          <Form.Control value={name} onChange={nameChange} />
        </Form.Group>
        <Form.Group controlId="servings">
          <Form.Label>Annoksia:</Form.Label>
          <Form.Control type="number" value={servings} onChange={servingsChange} />
        </Form.Group>
        <Form.Group controlId="time">
          <Form.Label>Työaika: </Form.Label>
          <Form.Control value={time} onChange={timeChange} />
        </Form.Group>
        <br />
        <Form.Group controlId="ingredients">
          <Form.Label>Ainesosat</Form.Label>
          <Form.Control as="textarea" onChange={ingredientsChange} rows={8} cols={50} maxLength={10000} />
        </Form.Group>
        <br />
        <Form.Group controlId="steps">
          <Form.Label>Työvaiheet</Form.Label>
          <Form.Control as="textarea" onChange={stepsChange} rows={8} cols={100} maxLength={10000} />
        </Form.Group>
        <br />
        <Button type="submit" color="purple">
          Tarkista
        </Button>
      </Form>
      <br />
      {postCheck ? <CheckView recipeInfo={{ name, time, servings }} ingredients={ingredients} steps={steps} formatIngredients={formatIngredients} /> : <div /> }
    </div>
  )
}

export default AddRecipe
