import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { getIngredientNames } from 'Utilities/services/ingredients'
import { userIsAdmin } from 'Utilities/services/users'

import CheckView from './CheckView'

const AddRecipe = () => {
  const [name, setName] = useState('')
  const [servings, setServings] = useState(0)
  const [time, setTime] = useState('')
  const [info, setInfo] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [postCheck, setPostCheck] = useState(false)
  const [ingredientList, setIngredientList] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async () => {
    const query = await userIsAdmin()
    setIsAdmin(query.isAdmin)
  }

  const handleCheck = async (event) => {
    event.preventDefault()
    setPostCheck(true)
  }

  const handleGetIngredients = async () => {
    const allIngredients = await getIngredientNames()
    setIngredientList(allIngredients.map((i) => (i.name)))
  }

  useEffect(() => {
    handleGetIngredients()
    checkAdminStatus()
  }, [])

  const nameChange = ({ target }) => setName(target.value)
  const servingsChange = ({ target }) => setServings(target.value)
  const timeChange = ({ target }) => setTime(target.value)
  const infoChange = ({ target }) => setInfo(target.value)
  const ingredientsChange = ({ target }) => setIngredients(target.value)
  const stepsChange = ({ target }) => setSteps(target.value)

  if (!isAdmin) {
    return <div>Tämä sivu on vain pääkäyttäjille!</div>
  }

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
        <Form.Group controlId="info">
          <Form.Label>Lisätietoja, esim. alkuperäisen reseptin nettiosoite: </Form.Label>
          <Form.Control value={info} onChange={infoChange} />
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
      {postCheck ? (
        <CheckView
          recipeInfo={{
            name,
            time,
            servings,
            info,
          }}
          ingredients={ingredients}
          steps={steps}
          ingredientList={ingredientList}
        />
      ) : <div />}
    </div>
  )
}

export default AddRecipe
