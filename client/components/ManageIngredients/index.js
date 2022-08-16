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
  replaceIngredientName,
  deleteIngredient,
} from 'Utilities/services/ingredients'
import ControlButton from './ControlButton'

import foodNames from '../../assets/foodNames.json'

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

  const handleAdd = () => {
    // Added ingredients have id <= 0
    // Edits of existing ones are recognised from a higher id
    setIngredientList([{
      id: ingredientList[0].id > 0 ? 0 : ingredientList[0].id - 1,
      name: '',
      count: 0,
      edited: true,
    }, ...ingredientList])
  }

  const handleChange = (event, id) => {
    const { name, value } = event.target
    const element = ingredientList.filter((i) => i.id === id)[0]
    element[name] = value
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
      const replaced = await replaceIngredientName(ingredient)
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

  if (!isAdmin.isAdmin) {
    return (
      <div>
        Tämä sivu on vain pääkäyttäjille!
      </div>
    )
  }

  const filtered = ingredientList.filter((i) => i.name.includes(filter.toLowerCase()) || i.edited)

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
              <Button size="sm" onClick={handleAdd}>
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
                <input value={ingredient.name} name="name" onChange={(event) => handleChange(event, ingredient.id)} />
                <ControlButton
                  ingredient={ingredient}
                  handleRemove={handleRemove}
                  handleReplace={handleReplace}
                  handleDelete={handleDelete}
                  handleAddIngredient={handleAddIngredient}
                />
              </td>
              <td>{ingredient.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ManageIngredients
