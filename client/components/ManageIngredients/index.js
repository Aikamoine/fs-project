import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { localStorageName, adminLevels } from 'Utilities/common'

import {
  getIngredients,
  addIngredient,
  getFromFineliApi,
  updateIngredient,
  deleteIngredient,
} from 'Utilities/services/ingredients'
import useGetUserInfo from 'Components/hooks/useGetUserInfo'
import { useGlobalState } from 'Components/hooks/GlobalState'
import ControlButton from './ControlButton'

import foodNames from '../../assets/foodNames.json'
import Instructions from './Instructions'

const roundNumber = (value) => Math.round(Number(value) * 100) / 100

const ManageIngredients = () => {
  const [ingredientList, setIngredientList] = useState([])
  const [fineliIngredients, setFineliIngredients] = useState()
  const [filter, setFilter] = useState('')
  const [instructions, setInstructions] = useState(false)
  const [globalState, updateGlobalState] = useGlobalState()

  const handleGetIngredients = async () => {
    const allIngredients = await getIngredients()
    setIngredientList(allIngredients)
    const fineliNames = foodNames.map((food) => ({ value: food.FOODID, label: `${food.FOODNAME}, ${food.FOODTYPE}` }))
    setFineliIngredients(fineliNames)
    setFilter('')
  }

  useGetUserInfo()

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      handleGetIngredients()
    } else {
      updateGlobalState({ adminLevel: 0 })
    }
  }, [])

  const handleNew = () => {
    // Added ingredients have id <= 0
    // Edits of existing ones are recognised from a higher id
    setIngredientList([{
      id: ingredientList[0].id > 0 ? 0 : ingredientList[0].id - 1,
      name: '',
      count: 0,
      edited: true,
      kcal: 0,
      fat: 0,
      satfat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      unitweight: 0,
      volumeweight: 0,
      details: true,
      originalname: '',
      sidedish: false,
      servingsize: 0,
    }, ...ingredientList])
  }

  const handleChange = (event, id) => {
    const { name, value } = event.target
    const element = ingredientList.filter((i) => i.id === id)[0]
    if (name === 'name') {
      element[name] = value
    } else {
      element[name] = value.replace(',', '.')
    }
    element.edited = true
    setIngredientList([...ingredientList])
  }

  const handleRemove = (event, id) => {
    const filteredArray = ingredientList.filter((i) => i.id !== id)
    setIngredientList(filteredArray)
  }

  const handleSideDishChange = (id) => {
    const item = ingredientList.filter((i) => i.id === id)[0]
    if (item.sidedish) {
      item.servingsize = 0
    }
    item.sidedish = !item.sidedish
    item.edited = true
    setIngredientList([...ingredientList])
  }
  const handleReplace = async (event, ingredient) => {
    const replaceMessage = ingredient.originalname === ingredient.name ? '' : `Kaikki ${ingredient.originalname} -nimiset ainesosat korvataan ainesosan ${ingredient.name} tiedoilla.`
    // eslint-disable-next-line no-alert
    if (window.confirm(`Haluatko päivittää tietoja ainesosalle ${ingredient.originalname}? ${replaceMessage}`)) {
      toast('Päivitetään...')
      try {
        const replaced = await updateIngredient(ingredient)
        toast(replaced.message)
        handleGetIngredients()
      } catch (error) {
        toast(`Tapahtui virhe: ${error}`)
      }
    }
  }

  const handleFineliChange = async (selectedOptions) => {
    try {
      const data = await getFromFineliApi(selectedOptions.value)
      console.log('got from fineli', data)
      const unitweight = data.units.find((u) => u.code === 'KPL_M')
      const volumeweight = data.units.find((u) => u.code === 'DL')

      setIngredientList([{
        id: ingredientList[0].id > 0 ? 0 : ingredientList[0].id - 1,
        name: data.name.fi.toLowerCase(),
        count: 0,
        edited: true,
        kcal: roundNumber(data.energyKcal),
        fat: roundNumber(data.fat),
        satfat: roundNumber(data.saturatedFat),
        carbs: roundNumber(data.carbohydrate),
        sugars: roundNumber(data.sugar),
        protein: roundNumber(data.protein),
        unitweight: unitweight ? unitweight.mass : 0,
        volumeweight: volumeweight ? volumeweight.mass : 0,
        details: true,
        originalname: data.name.fi.toLowerCase(),
        sidedish: false,
        servingsize: 0,
      }, ...ingredientList])
    } catch (error) {
      if (error.response) {
        toast(`${error.response.data.error}`)
      } else {
        toast(`Haku ei onnistunut, virhe: ${error}`)
      }
    }
  }

  const handleDelete = async (event, ingredient) => {
    try {
      const deleted = await deleteIngredient(ingredient)
      toast(deleted.message)
      handleGetIngredients()
    } catch (error) {
      if (error.response) {
        toast(`${error.response.data.error}`)
      } else {
        toast(`Poisto ei onnistunut, virhe: ${error}`)
      }
    }
  }

  const handleAddIngredient = async (event, ingredient) => {
    try {
      toast(`Lisätään ainesosaa ${ingredient.name}`)
      const added = await addIngredient(ingredient)
      toast(added.message)
      handleGetIngredients()
    } catch (error) {
      if (error.response) {
        toast(`${error.response.data.error}`)
      } else {
        toast(`Lisäys ei onnistunut, virhe: ${error}`)
      }
    }
  }

  if (globalState.adminLevel < adminLevels('editor')) {
    return (
      <div>
        Tämä sivu on vain pääkäyttäjille!
      </div>
    )
  }

  const filtered = ingredientList.filter((i) => i.originalname.includes(filter.toLowerCase()) || i.edited)

  return (
    <div>
      <div>
        <Button onClick={() => setInstructions(!instructions)}>{instructions ? 'Piilota ohjeet' : 'Näytä ohjeet'}</Button>
        {instructions && <Instructions />}
        <br />
      </div>
      <div>
        Hae ainesosa Finelistä
        <Select options={fineliIngredients} onChange={handleFineliChange} />
      </div>
      <br />
      <Accordion defaultActiveKey="0">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                {'Nimi   '}
                <Button size="sm" onClick={handleNew}>
                  Lisää ainesosa
                </Button>
              </th>
            </tr>
            <tr>
              <td>
                suodatus: <input value={filter} onChange={({ target }) => setFilter(target.value)} />
              </td>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ingredient, index) => (
              <tr key={ingredient.id}>
                <td>
                  <Accordion.Item eventKey={index + 1}>
                    <Accordion.Header>
                      <Row>
                        <Col>
                          <Card style={{ width: '15em' }}>
                            <Card.Body>{ingredient.originalname}</Card.Body>
                          </Card>
                        </Col>
                        <Col>
                          <Card style={{ width: '13em' }}>
                            <Card.Body>{` käytössä ${ingredient.count} reseptissä `}</Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Accordion.Header>
                    <Accordion.Body>
                      <input value={ingredient.name} name="name" onChange={(event) => handleChange(event, ingredient.id)} />
                      {'     '}
                      <Button size="sm" onClick={() => handleSideDishChange(ingredient.id)}>{ingredient.sidedish ? 'on lisuke' : 'ei ole lisuke'}</Button>
                      {'     '}
                      {ingredient.sidedish && (
                        <div>
                          Lisukkeen annoskoko: <input value={ingredient.servingsize} type="number" name="servingsize" onChange={(event) => handleChange(event, ingredient.id)} />
                        </div>
                      )}
                      <Table>
                        <thead>
                          <tr>
                            <th>kcal</th>
                            <th>rasva</th>
                            <th>Tyydyt. rasva</th>
                            <th>hiilihydraatti</th>
                            <th>sokeri</th>
                            <th>proteiini</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input style={{ width: '100%' }} value={ingredient.kcal} name="kcal" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.fat} name="fat" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.satfat} name="satfat" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.carbs} name="carbs" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.sugars} name="sugars" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.protein} name="protein" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                          </tr>
                        </tbody>
                      </Table>
                      <Table>
                        <thead>
                          <tr>
                            <th>Kpl/pkt/prk painaa (grammaa)</th>
                            <th>Desi painaa (grammaa)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input style={{ width: '100%' }} value={ingredient.unitweight} name="unitweight" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '100%' }} value={ingredient.volumeweight} name="volumeweight" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                          </tr>
                        </tbody>
                      </Table>
                      <ControlButton
                        ingredient={ingredient}
                        handleRemove={handleRemove}
                        handleReplace={handleReplace}
                        handleDelete={handleDelete}
                        handleAddIngredient={handleAddIngredient}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Accordion>
    </div>
  )
}

export default ManageIngredients
