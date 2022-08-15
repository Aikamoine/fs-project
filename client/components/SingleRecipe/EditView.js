/* eslint-disable no-unused-vars */
// disabled only for the {event => } lines, don't know if necessary...
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import { editRecipe } from 'Utilities/services/recipes'

const EditView = ({ recipeDetails, setIsEditing, urlName }) => {
  const [name, setName] = useState(recipeDetails.recipe.name)
  const [servings, setServings] = useState(recipeDetails.recipe.servings)
  const [time, setTime] = useState(recipeDetails.recipe.time)
  const [ingredients, setIngredients] = useState(recipeDetails.ingredients)
  const [steps, setSteps] = useState(recipeDetails.recipe.recipe_steps)

  const changeIngredients = (event, id) => {
    const { name, value } = event.target

    const element = ingredients.filter((i) => i.id === id)[0]
    if (name === 'amount') {
      element[name] = value.replace(',', '.')
    } else {
      element[name] = value
    }
    setIngredients([...ingredients])
  }

  const changeSteps = (event, id) => {
    const { value } = event.target

    const step = steps.filter((i) => i.id === id)[0]

    step.step = value

    setSteps([...steps])
  }

  const deleteIngredient = (id) => {
    const filtered = ingredients.filter((i) => i.id !== id)
    setIngredients(filtered)
  }

  const deleteStep = (id) => {
    const filtered = steps.filter((s) => s.id !== id)
    setSteps(filtered)
  }

  const handleSave = async () => {
    const toEdit = {
      ...recipeDetails,
      newName: name,
      newServings: servings,
      newTime: time,
      newIngredients: ingredients,
      newSteps: steps,
    }
    console.log('handleSave', toEdit, urlName)
    await editRecipe(toEdit, urlName)
  }

  return (
    <div>
      <Button variant="danger" onClick={(event) => setIsEditing(false)}>
        Peru muutokset
      </Button>
      <br />
      <br />
      <div>
        Nimi: <input value={name} onChange={({ target }) => setName(target.value)} />
      </div>
      <div>
        Annoksia: <input type="number" value={servings} onChange={({ target }) => setServings(target.value)} />
      </div>
      <div>
        Työaika: <input value={time} onChange={({ target }) => setTime(target.value)} />
      </div>
      <br />

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
            <tr key={ingredient.id}>
              <td>
                <input value={ingredient.amount ? ingredient.amount : ''} name="amount" onChange={(event) => changeIngredients(event, ingredient.id)} />
              </td>
              <td>
                <input value={ingredient.unit ? ingredient.unit : ''} name="unit" onChange={(event) => changeIngredients(event, ingredient.id)} />
              </td>
              <td>
                <input value={ingredient.name ? ingredient.name : ''} name="name" onChange={(event) => changeIngredients(event, ingredient.id)} />
              </td>
              <td>
                <Button size="sm" onClick={(event) => deleteIngredient(ingredient.id)}>
                  Poista
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Työvaihe</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.id}>
              <td>
                <input size="50" value={step.step} onChange={(event) => changeSteps(event, step.id)} />
              </td>
              <td>
                <Button size="sm" onClick={(event) => deleteStep(step.id)}>
                  Poista
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={handleSave}>
        Tallenna muutokset
      </Button>
    </div>
  )
}

export default EditView
