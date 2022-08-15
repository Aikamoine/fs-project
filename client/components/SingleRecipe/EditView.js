/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
// disabled only for the {event => } lines, don't know if necessary...
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

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

  const handleIngredientDrag = (e) => {
    if (e.source.index !== e.destination.index) {
      const dragged = ingredients[e.source.index]
      const bumped = ingredients[e.destination.index]

      const smallerIndices = ingredients.filter((i, index) => index < e.destination.index && i.id !== dragged.id)
      const largerIndices = ingredients.filter((i, index) => index > e.destination.index && i.id !== dragged.id)

      if (e.destination.index === 0) {
        setIngredients([...smallerIndices, dragged, bumped, ...largerIndices])
      } else {
        setIngredients([...smallerIndices, bumped, dragged, ...largerIndices])
      }
    }
  }

  const handleStepDrag = (e) => {
    if (e.source.index !== e.destination.index) {
      const dragged = steps[e.source.index]
      const bumped = steps[e.destination.index]

      const smallerIndices = steps.filter((i, index) => index < e.destination.index && i.id !== dragged.id)
      const largerIndices = steps.filter((i, index) => index > e.destination.index && i.id !== dragged.id)

      if (e.destination.index === 0) {
        setSteps([...smallerIndices, dragged, bumped, ...largerIndices])
      } else {
        setSteps([...smallerIndices, bumped, dragged, ...largerIndices])
      }
    }
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
      <DragDropContext onDragEnd={handleIngredientDrag}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th> </th>
              <th>Määrä</th>
              <th>Yksikkö</th>
              <th>Ainesosa</th>
            </tr>
          </thead>
          <Droppable droppableId="droppable-1">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {ingredients.map((ingredient, index) => (
                  <Draggable key={ingredient.id} draggableId={String(ingredient.id)} index={index}>
                    {(provider) => (
                      <tr key={ingredient.id} {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
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
                    )}
                  </Draggable>
                ))}
                {(provider.placeholder)}
              </tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
      <br />
      <DragDropContext onDragEnd={handleStepDrag}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th> </th>
              <th>Työvaihe</th>
            </tr>
          </thead>
          <Droppable droppableId="droppable-2">
            {(provider) => (
              <tbody ref={provider.innerRef} {...provider.droppableProps}>
                {steps.map((step, index) => (
                  <Draggable key={step.id} draggableId={String(step.id)} index={index}>
                    {(provider) => (
                      <tr key={step.id} {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>
                          <input size="50" value={step.step} onChange={(event) => changeSteps(event, step.id)} />
                        </td>
                        <td>
                          <Button size="sm" onClick={(event) => deleteStep(step.id)}>
                            Poista
                          </Button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {(provider.placeholder)}
              </tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
      <Button onClick={handleSave}>
        Tallenna muutokset
      </Button>
    </div>
  )
}

export default EditView
