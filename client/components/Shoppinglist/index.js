/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { useChecklist } from 'react-checklist'
import Button from 'react-bootstrap/Button'
import ErrorView from 'Components/ErrorView'
import {
  getShoppinglist, deleteList, removeFromList, getShoppinglistRecipes,
} from 'Utilities/services/shoppinglists'

const Shoppinglist = () => {
  const [shoppingList, setShoppingList] = useState([])
  const [recipes, setRecipes] = useState([])

  const handleGetShoppingList = async () => {
    const list = await getShoppinglist()
    setShoppingList(list)
    const recipeList = await getShoppinglistRecipes()
    console.log('recipeList', recipeList)
    setRecipes(recipeList)
  }

  const { handleCheck, checkedItems } = useChecklist(shoppingList, {
    key: 'id',
    keyType: 'number',
  })

  useEffect(() => {
    handleGetShoppingList()
  }, [])

  const deleteShoppingList = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Haluatko poistaa koko ostoslistasi?')) {
      setShoppingList([])
      await deleteList()
    }
  }

  const deleteSelected = async () => {
    const checkedArray = [...checkedItems]
    const filtered = shoppingList.filter((item) => !checkedArray.includes(item.id))

    removeFromList(checkedArray)
    setShoppingList(filtered)
  }

  if (!shoppingList) {
    return (
      <div>ladataan...</div>
    )
  }

  if (shoppingList.message) {
    return <ErrorView error={shoppingList.message} />
  }

  console.log('recipes', recipes)
  return (
    <div>
      <h2>Ostoslista</h2>
      {shoppingList.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            data-key={item.id}
            onChange={handleCheck}
            checked={checkedItems.has(item.id)}
          />
          <label>{Number(item.amount) > 0 ? Number(item.amount) : ''} {item.unit} {item.ingredient.name}</label>
        </div>
      ))}
      <br />
      <p>
        <Button type="submit" onClick={deleteSelected}>
          Poista valinnat ostoslistalta
        </Button>
      </p>
      <p>
        <Button type="submit" onClick={deleteShoppingList}>
          Tyhjennä ostoslista
        </Button>
      </p>
    </div>
  )
}

export default Shoppinglist
