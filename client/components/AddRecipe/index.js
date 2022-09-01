import React, { useState, useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { localStorageName, adminLevels } from 'Utilities/common'
import { getAdminLevel } from 'Utilities/services/users'
import { addRecipe } from 'Utilities/services/recipes'
import IngredientSelector from 'Components/selectors/IngredientSelector'
import TagSelector from 'Components/selectors/TagSelector'
import Instructions from './Instructions'

const formatUrlName = (name) => {
  let urlName
  urlName = name.replace(/ /gi, '_').toLowerCase()
  urlName = urlName.replace(/ä/g, 'a')
  urlName = urlName.replace(/ö/g, 'o')
  urlName = urlName.replace(/[^a-z_]/g, '')

  return urlName
}

const AddRecipe = () => {
  const [name, setName] = useState('')
  const [servings, setServings] = useState(0)
  const [time, setTime] = useState('')
  const [info, setInfo] = useState('')
  const [sideDish, setSideDish] = useState(false)
  const [tagChoices, setTagChoices] = useState([])
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [adminLevel, setAdminLevel] = useState(0)
  const [instructions, setInstructions] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  const checkAdminStatus = async () => {
    const level = await getAdminLevel()
    setAdminLevel(level.adminLevel)
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkAdminStatus()
    } else {
      setAdminLevel(0)
    }
  }, [])

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
      id: ingredient.id,
      name: ingredient.name,
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
        usesSideDish: !sideDish, // recipe includes a side dish, so it doesn't use one
        urlName: formatUrlName(name),
        ingredients,
        tags: tagChoices,
        steps: steps.split('\n'),
      },
    )

    navigate('/recipes', { replace: false })
  }

  if (adminLevel < adminLevels('editor')) {
    return (
      <div>
        Tämä sivu on vain pääkäyttäjille!
      </div>
    )
  }

  return (
    <div>
      <Button onClick={() => setInstructions(!instructions)}>{instructions ? 'Piilota ohjeet' : 'Näytä ohjeet'}</Button>
      {instructions && <Instructions />}
      <br />
      <h3>Perustiedot</h3>
      <Form>
        <Form.Group controlId="recipe-name">
          <Form.Label>Reseptin nimi:</Form.Label>
          <Form.Control value={name} onChange={(event) => setName(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="servings">
          <Form.Label>Annoksia:</Form.Label>
          <Form.Control type="number" value={servings} onChange={(event) => setServings(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="time">
          <Form.Label>Työaika: </Form.Label>
          <Form.Control value={time} onChange={(event) => setTime(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="info">
          <Form.Label>Lisätietoja, esim. alkuperäisen reseptin nettiosoite: </Form.Label>
          <Form.Control value={info} onChange={(event) => setInfo(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="tags">
          <Form.Label>Tunnisteet</Form.Label>
          <TagSelector onChange={handleTagsChange} />
        </Form.Group>
        <Form.Group controlId="side-dish">
          <Form.Label>Sisältääkö resepti lisukkeen</Form.Label>
          <Button onClick={() => setSideDish(!sideDish)}>{sideDish ? 'kyllä' : 'ei'}</Button>
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
              <IngredientSelector onChange={handleIngredientChange} isClearable />
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
              <tr key={`${i.id} + ${i.amount}`}>
                <td>{i.amount}</td>
                <td>{i.unit}</td>
                <td>{i.name}</td>
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
      <textarea style={{ width: '100%' }} onChange={(event) => setSteps(event.target.value)} maxLength={10000} />
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
