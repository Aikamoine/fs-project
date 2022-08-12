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

import foodNames from '../../assets/foodNames.json'

const ControlButton = ({
  index,
  ingredient,
  handleRemove,
  handleReplace,
  handleDelete,
  handleAddIngredient,
}) => {
  if (!ingredient.name) {
    return null
  }

  if (Number(ingredient.count) === 0 && !ingredient.edited) {
    return (
      <Button size="sm" onClick={(event) => handleDelete(event, ingredient)}>Poista kokonaan</Button>
    )
  }

  if (!ingredient.edited) {
    return null
  }

  if (ingredient.id <= 0) {
    return (
      <>
        <Button variant="danger" size="sm" onClick={(event) => handleRemove(event, index)}>Peru lisäys</Button>
        {'    '}
        <Button size="sm" onClick={(event) => handleAddIngredient(event, ingredient)}>Lisää ainesosa</Button>
      </>
    )
  }

  if (Number(ingredient.count) === 0) {
    return (
      <>
        <Button variant="warning" size="sm" onClick={(event) => handleReplace(event, ingredient)}>Korvaa nykyisellä tekstillä</Button>
        <Button variant="danger" size="sm" onClick={(event) => handleDelete(event, index)}>Poista kokonaan</Button>
      </>
    )
  }
  return (
    <Button variant="warning" size="sm" onClick={(event) => handleReplace(event, ingredient)}>Korvaa nykyisellä tekstillä</Button>
  )
}

const ManageIngredients = () => {
  const [ingredientList, setIngredientList] = useState([])
  const [fineliIngredients, setFineliIngredients] = useState()
  const [isAdmin, setIsAdmin] = useState(false)

  const handleGetIngredients = async () => {
    const admin = await userIsAdmin()
    setIsAdmin(admin)
    const allIngredients = await getIngredients()
    setIngredientList(allIngredients)
    const fineliNames = foodNames.map((food) => ({ value: food.FOODID, label: `${food.FOODNAME}, ${food.FOODTYPE}` }))
    setFineliIngredients(fineliNames)
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

  const handleChange = (event, index) => {
    const { name, value } = event.target
    const list = [...ingredientList]
    list[index][name] = value
    list[index].edited = true
    setIngredientList(list)
  }

  const handleRemove = (event, index) => {
    const filteredArray = ingredientList.filter((ing, i) => i !== index)
    setIngredientList(filteredArray)
  }

  const handleReplace = async (event, ingredient) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Hyväksymällä kaikki kannassa ID:llä ${ingredient.id} olevat ainesosat korvataan nimellä ${ingredient.name}`)) {
      const replaced = await replaceIngredientName(ingredient)
      // toast(`Korvattu '${replaced.originalName}' arvolla '${replaced.newName}' kaikissa resepteissä`)
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
    console.log('deleting', ingredient)
    const deleted = await deleteIngredient(ingredient)
    console.log('deleted', deleted)
    toast(deleted.message)
    handleGetIngredients()
  }

  const handleAddIngredient = async (event, ingredient) => {
    console.log('adding', ingredient)
    const added = await addIngredient(ingredient)
    console.log('added', added)
  }

  if (!isAdmin.isAdmin) {
    return (
      <div>
        Tämä sivu on vain pääkäyttäjille!
      </div>
    )
  }

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
        </thead>
        <tbody>
          {ingredientList.map((ingredient, index) => (
            <tr key={ingredient.id}>
              <td>
                <input value={ingredient.name} name="name" onChange={(event) => handleChange(event, index)} />
                <ControlButton
                  index={index}
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
