import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

import { getIngredients, updateIngredients } from 'Utilities/services/ingredients'

const ManageIngredients = () => {
  const [ingredientList, setIngredientList] = useState([])

  const handleGetIngredients = async () => {
    const allIngredients = await getIngredients()
    setIngredientList(allIngredients)
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

  return (
    <div>
      <Button size="sm" onClick={handleAdd}>
        Lisää ainesosa
      </Button>
      {'              '}
      <Button size="sm" onClick={handleSave}>
        Tallenna muutokset
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nimi</th>
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
