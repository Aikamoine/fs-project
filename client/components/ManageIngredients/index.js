import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { userIsAdmin } from 'Utilities/services/users'
import {
  getIngredients,
  // updateIngredients,
  addIngredient,
  getFromFineliApi,
  replaceIngredient,
  deleteIngredient,
} from 'Utilities/services/ingredients'
import ControlButton from './ControlButton'

import foodNames from '../../assets/foodNames.json'

const roundNumber = (value) => Math.round(Number(value) * 100) / 100

const ManageIngredients = () => {
  const [ingredientList, setIngredientList] = useState([])
  const [fineliIngredients, setFineliIngredients] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const [filter, setFilter] = useState('')

  const handleGetIngredients = async () => {
    const admin = await userIsAdmin()
    setIsAdmin(admin)
    const allIngredients = await getIngredients()
    setIngredientList(allIngredients)
    const fineliNames = foodNames.map((food) => ({ value: food.FOODID, label: `${food.FOODNAME}, ${food.FOODTYPE}` }))
    setFineliIngredients(fineliNames)
    setFilter('')
  }

  useEffect(() => {
    handleGetIngredients()
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
      sat_fat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      unit_weight: 0,
      volume_weight: 0,
      details: true,
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

  const handleReplace = async (event, ingredient) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Hyväksymällä kaikki kannassa ID:llä ${ingredient.id} olevat ainesosat korvataan nimellä ${ingredient.name}`)) {
      toast('Korvataan...')
      const replaced = await replaceIngredient(ingredient)
      toast(replaced.message)
      handleGetIngredients()
    }
  }

  const handleFineliChange = async (selectedOptions) => {
    const data = await getFromFineliApi(selectedOptions.value)
    console.log('got from fineli', data)
    setIngredientList([{
      id: ingredientList[0].id > 0 ? 0 : ingredientList[0].id - 1,
      name: data.name.fi.toLowerCase(),
      count: 0,
      edited: true,
      kcal: roundNumber(data.energyKcal),
      fat: roundNumber(data.fat),
      sat_fat: roundNumber(data.saturatedFat),
      carbs: roundNumber(data.carbohydrate),
      sugars: roundNumber(data.sugar),
      protein: roundNumber(data.protein),
      unit_weight: 0,
      volume_weight: 0,
      details: true,
    }, ...ingredientList])
  }

  const handleDelete = async (event, ingredient) => {
    const deleted = await deleteIngredient(ingredient)
    toast(deleted.message)
    handleGetIngredients()
  }

  const handleAddIngredient = async (event, ingredient) => {
    try {
      toast(`Lisätään ainesosaa ${ingredient.name}`)
      const added = await addIngredient(ingredient)
      toast(added.message)
      handleGetIngredients()
    } catch (error) {
      console.log('error', error)
    }
  }

  const toggleDetails = (id) => {
    const ingredient = ingredientList.filter((i) => i.id === id)[0]
    ingredient.details = !ingredient.details
    setIngredientList([...ingredientList])
  }

  if (!isAdmin.isAdmin) {
    return (
      <div>
        Tämä sivu on vain pääkäyttäjille!
      </div>
    )
  }

  const filtered = ingredientList.filter((i) => i.name.includes(filter.toLowerCase()) || i.edited)
  console.log(filtered)
  return (
    <div>
      <div>
        Hae ainesosa Finelistä
        <Select options={fineliIngredients} onChange={handleFineliChange} />
      </div>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              {'Nimi    '}
              <Button size="sm" onClick={handleNew}>
                Lisää ainesosa
              </Button>
            </th>
            <th>Käyttökertoja</th>
          </tr>
          <tr>
            <td>
              suodatus: <input value={filter} onChange={({ target }) => setFilter(target.value)} />
            </td>
            <td />
          </tr>
        </thead>
        <tbody>
          {filtered.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>
                <div>
                  <input value={ingredient.name} name="name" onChange={(event) => handleChange(event, ingredient.id)} />
                  <ControlButton
                    ingredient={ingredient}
                    handleRemove={handleRemove}
                    handleReplace={handleReplace}
                    handleDelete={handleDelete}
                    handleAddIngredient={handleAddIngredient}
                  />
                </div>
                {
                  ingredient.details
                  && (
                    <>
                      <Table>
                        <thead>
                          <tr>
                            <th>kcal</th>
                            <th>rasva</th>
                            <th>t. rasva</th>
                            <th>hii.hyd.</th>
                            <th>sokeri</th>
                            <th>proteiini</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input style={{ width: '100%' }} value={ingredient.kcal} name="kcal" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.fat} name="fat" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.sat_fat} name="sat_fat" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.carbs} name="carbs" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.sugars} name="sugars" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '80%' }} value={ingredient.protein} name="protein" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                          </tr>
                        </tbody>
                      </Table>
                      <Table>
                        <thead>
                          <tr>
                            <th>Kappale painaa (grammaa)</th>
                            <th>Desi painaa (grammaa)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input style={{ width: '100%' }} value={ingredient.unit_weight} name="unit_weight" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                            <td><input style={{ width: '100%' }} value={ingredient.volume_weight} name="volume_weight" onChange={(event) => handleChange(event, ingredient.id)} /></td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )
                }
              </td>
              <td>
                {ingredient.count}
                <Button size="sm" onClick={() => toggleDetails(ingredient.id)}>
                  {ingredient.details ? <>Piilota</> : <>Näytä</>}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ManageIngredients
