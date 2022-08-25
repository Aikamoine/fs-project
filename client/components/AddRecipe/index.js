import React, { useState, useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { localStorageName } from 'Utilities/common'
import { userIsAdmin } from 'Utilities/services/users'
import { addRecipe, getTags } from 'Utilities/services/recipes'
import IngredientSelector from 'Components/IngredientSelector'
import TagSelector from 'Components/TagSelector'

const formatUrlName = (name) => {
  const spacesToUnderScore = name.replace(' ', '_').toLowerCase()
  const umlautAToA = spacesToUnderScore.replace('ä', 'a')
  const umlautOToO = umlautAToA.replace('ö', 'o')

  return umlautOToO.replace(/[^a-z_]/g, '')
}

const AddRecipe = () => {
  const [name, setName] = useState('')
  const [servings, setServings] = useState(0)
  const [time, setTime] = useState('')
  const [info, setInfo] = useState('')
  const [tagChoices, setTagChoices] = useState([])
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  const checkAdminStatus = async () => {
    const query = await userIsAdmin()
    setIsAdmin(query.isAdmin)
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [])

  const nameChange = ({ target }) => setName(target.value)
  const servingsChange = ({ target }) => setServings(target.value)
  const timeChange = ({ target }) => setTime(target.value)
  const infoChange = ({ target }) => setInfo(target.value)
  const stepsChange = ({ target }) => setSteps(target.value)

  const handleIngredientChange = (selectedOptions) => {
    if (selectedOptions) {
      setIngredient({
        id: selectedOptions.value,
        name: selectedOptions.label,
      })
    }
  }

  const handleTagsChange = (selectedOptions) => {
    if (selectedOptions) {
      setTagChoices(selectedOptions)
    }
  }

  const addIngredient = () => {
    const newIngredient = {
      ingredient,
      unit,
      amount: !amount ? '' : amount.replace(',', '.'),
    }
    setIngredients([...ingredients, newIngredient])
    setAmount('')
    setUnit('')
    setIngredient('')
    ref.current.focus()
  }

  const deleteIngredient = (index) => {
    setIngredients(ingredients.filter((ing, ind) => ind !== index))
  }

  const handleSend = async () => {
    if (!name) {
      toast('Reseptillä pitää olla nimi!')
      return
    }

    if (servings < 0 || servings > 20) {
      toast('Tarkista annosten määrä')
      return
    }

    if (ingredients.length < 2) {
      toast('Ainesosia ei ole lisätty tarpeeksi')
      return
    }

    if (steps.length < 2) {
      toast('Työvaiheita ei ole lisätty tarpeeksi')
      return
    }

    toast('Reseptiä lisätään. Sinut ohjataan seuraavalle sivulle, kun lisäys on valmis')
    await addRecipe(
      {
        name,
        servings,
        time,
        info,
        urlName: formatUrlName(name),
        ingredients,
        tags: tagChoices,
        steps: steps.split('\n'),
      },
    )

    navigate('/recipes', { replace: false })
  }

  if (!isAdmin) {
    return <div>Tämä sivu on vain pääkäyttäjille!</div>
  }

  console.log('choices', tagChoices)
  return (
    <div>
      <h3>Perustiedot</h3>
      <Form>
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
        <Form.Group controlId="tags">
          <Form.Label>Tunnisteet</Form.Label>
          <TagSelector onChange={handleTagsChange} />
        </Form.Group>
      </Form>
      <br />
      <h3>Ainesosat</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Määrä</th>
            <th>Yksikkö</th>
            <th>Ainesosa</th>
            <th>{ }</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input ref={ref} style={{ width: '5em' }} value={amount} name="amount" onChange={({ target }) => setAmount(target.value)} />
            </td>
            <td>
              <input style={{ width: '7em' }} value={unit} name="unit" onChange={({ target }) => setUnit(target.value)} />
            </td>
            <td>
              <IngredientSelector onChange={handleIngredientChange} />
            </td>
            <td>
              <Button size="sm" onClick={addIngredient}>
                Lisää
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <br />
      {ingredients.length > 0
        && (
        <Table>
          <thead>
            <tr>
              <th>Määrä</th>
              <th>Yksikkö</th>
              <th>Ainesosa</th>
              <th>{ }</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((i, index) => (
              <tr key={`${i.ingredient.id} + ${i.amount}`}>
                <td>{i.amount}</td>
                <td>{i.unit}</td>
                <td>{i.ingredient.name}</td>
                <td>
                  <Button size="sm" onClick={() => deleteIngredient(index)}>
                    Poista
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
      <br />
      <h3>Työvaiheet</h3>
      <textarea style={{ width: '100%' }} onChange={stepsChange} maxLength={10000} />
      {steps.split('\n').map((step, i) => (
        <div key={step}>{`${i + 1}. ${step}`}</div>
      ))}
      <br />
      <Button onClick={handleSend}>
        Lisää resepti
      </Button>
    </div>
  )
}

export default AddRecipe
