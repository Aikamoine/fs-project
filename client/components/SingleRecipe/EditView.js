/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import { useErrorHandler } from 'react-error-boundary'

import { deleteRecipe, editRecipe } from 'Utilities/services/recipes'
import IngredientSelector from 'Components/selectors/IngredientSelector'
import TagSelector from 'Components/selectors/TagSelector'

const EditView = ({ recipeDetails, setIsEditing, urlName }) => {
  const [name, setName] = useState(recipeDetails.recipe.name)
  const [servings, setServings] = useState(recipeDetails.recipe.servings)
  const [time, setTime] = useState(recipeDetails.recipe.time)
  const [info, setInfo] = useState(recipeDetails.recipe.info)
  const [sideDish, setSideDish] = useState(!recipeDetails.recipe.usesSideDish)
  const [ingredients, setIngredients] = useState(recipeDetails.ingredients)
  const [steps, setSteps] = useState(recipeDetails.recipe.recipe_steps)
  const [newId, setNewId] = useState(0)
  const [tagChoices, setTagChoices] = useState(recipeDetails.recipe.tags)

  const navigate = useNavigate()
  const handleError = useErrorHandler()

  const changeIngredients = (event, id) => {
    const { name, value } = event.target

    const element = ingredients.find((i) => i.id === id)
    if (name === 'amount') {
      element[name] = value.replace(',', '.')
    } else {
      element[name] = value
    }
    setIngredients([...ingredients])
  }

  const changeSteps = (event, id) => {
    const { value } = event.target

    const step = steps.find((i) => i.id === id)

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

  const addStep = () => {
    const newStep = {
      id: newId,
      number: steps.length > 0 ? steps[steps.length - 1].number + 1 : 0,
      step: '',
    }
    setNewId(newId - 1)
    setSteps([...steps, newStep])
  }

  const handleSave = async () => {
    const toEdit = {
      ...recipeDetails,
      newName: name,
      newServings: servings,
      newTime: time,
      newInfo: info,
      usesSideDish: !sideDish,
      newIngredients: ingredients,
      newSteps: steps.map((step) => step.step),
      newTags: tagChoices,
    }
    try {
      toast('Tallennetaan muutoksia')
      await editRecipe(toEdit, urlName)
      navigate('/recipes', { replace: false })
    } catch (error) {
      handleError(error)
    }
  }

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Haluatko varmasti poistaa ${recipeDetails.recipe.name} kokonaan? Tätä ei voi perua`)) {
      toast('Poistetaan reseptiä')
      try {
        await deleteRecipe(recipeDetails.recipe.id)
        navigate('/recipes', { replace: false })
      } catch (error) {
        handleError(error)
      }
    }
  }

  const handleIngredientDrag = (e) => {
    if (e.source.index !== e.destination.index) {
      const dragged = ingredients[e.source.index]
      const bumped = ingredients[e.destination.index]

      const smallerIndices = ingredients.filter((i, index) => index < e.destination.index && i.id !== dragged.id)
      const largerIndices = ingredients.filter((i, index) => index > e.destination.index && i.id !== dragged.id)

      if (e.source.index > e.destination.index) {
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

      if (e.source.index > e.destination.index) {
        setSteps([...smallerIndices, dragged, bumped, ...largerIndices])
      } else {
        setSteps([...smallerIndices, bumped, dragged, ...largerIndices])
      }
    }
  }

  const handleIngredientChange = (selectedOptions) => {
    if (selectedOptions) {
      const newIngredient = {
        id: selectedOptions.value,
        name: selectedOptions.label,
        amount: null,
        unit: '',
      }

      setNewId(newId - 1)
      setIngredients([...ingredients, newIngredient])
    }
  }

  const handleTagsChange = (selectedOptions) => {
    if (selectedOptions) {
      setTagChoices(selectedOptions)
    }
  }

  return (
    <div>
      <Button variant="danger" onClick={() => setIsEditing(false)}>
        Peru muutokset
      </Button>
      <br />
      <br />
      <Form>
        <Form.Group controlId="recipe-details">
          <Form.Label>Reseptin nimi:</Form.Label>
          <Form.Control value={name} onChange={({ target }) => setName(target.value)} />
          <Form.Label>Annoksia:</Form.Label>
          <Form.Control type="number" value={servings} onChange={({ target }) => setServings(target.value)} />
          <Form.Label>Työaika:</Form.Label>
          <Form.Control value={time} onChange={({ target }) => setTime(target.value)} />
          <Form.Label>Lisätieto:</Form.Label>
          <Form.Control value={info} onChange={({ target }) => setInfo(target.value)} />
          <Form.Label>Tunnisteet</Form.Label>
          <TagSelector
            onChange={handleTagsChange}
            defaultValue={recipeDetails.recipe.tags.map((tag) => ({ value: tag.value, label: tag.label }))}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Sisältääkö resepti lisukkeen</Form.Label>
          <Button onClick={() => setSideDish(!sideDish)}>{sideDish ? 'kyllä' : 'ei'}</Button>
        </Form.Group>
      </Form>
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
                  <Draggable key={`${ingredient.name}${index}`} draggableId={String(ingredient.id)} index={index}>
                    {(provider) => (
                      <tr key={`${ingredient.name}${index}`} {...provider.draggableProps} ref={provider.innerRef}>
                        <td {...provider.dragHandleProps}> = </td>
                        <td>
                          <input value={ingredient.amount ? ingredient.amount : ''} name="amount" onChange={(event) => changeIngredients(event, ingredient.id)} />
                        </td>
                        <td>
                          <input value={ingredient.unit ? ingredient.unit : ''} name="unit" onChange={(event) => changeIngredients(event, ingredient.id)} />
                        </td>
                        <td>
                          {ingredient.name ? ingredient.name : ''}
                        </td>
                        <td>
                          <Button size="sm" onClick={() => deleteIngredient(ingredient.id)}>
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
      <div>Lisää ainesosa</div>
      <IngredientSelector onChange={handleIngredientChange} isClearable />
      <br />
      <DragDropContext onDragEnd={handleStepDrag}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th> </th>
              <th>Työvaihe <Button size="sm" onClick={addStep}>Lisää työvaihe</Button></th>
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
                          <Button size="sm" onClick={() => deleteStep(step.id)}>
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
      <div>
        <Button onClick={handleSave}>
          Tallenna muutokset
        </Button>
      </div>
      <br />
      <div>
        <Button variant="danger" onClick={handleDelete}>
          Poista resepti kokonaan
        </Button>
      </div>
    </div>
  )
}

export default EditView
