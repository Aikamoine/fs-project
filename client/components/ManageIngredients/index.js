import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import Select from 'react-select'

import { getIngredients, updateIngredients, getFromFineliApi } from 'Utilities/services/ingredients'
import { userIsAdmin } from 'Utilities/services/users'
import foodNames from '../../assets/foodNames.json'

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

  const handleSave = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Haluatko päivittää tekemäsi muutokset kantaan? Tätä ei voi perua')) {
      const edited = ingredientList.filter((i) => i.edited)
      toast('Muutoksia tallennetaan')
      const response = await updateIngredients(edited)
      toast(`Tallennettu muutokset: ${response.map((i) => i.name)}`)
    }
  }

  const handleChange = (event, index) => {
    const { name, value } = event.target
    const list = [...ingredientList]
    list[index][name] = value
    list[index].edited = true
    setIngredientList(list)
  }

  const handleFineliChange = async (selectedOptions) => {
    console.log('fineli change', selectedOptions)
    const data = await getFromFineliApi(selectedOptions.value)
    console.log('got from fineli', data)
    setIngredientList([{
      id: ingredientList[0].id > 0 ? 0 : ingredientList[0].id - 1,
      name: data.name.fi.toLowerCase(),
      count: 0,
      edited: true,
    }, ...ingredientList])
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
              {'              '}
              <Button size="sm" onClick={handleSave}>
                Tallenna muutokset
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
