import React, { useState, useEffect } from 'react'
import { getShoppinglist, deleteList } from 'Utilities/services/shoppinglists'

const Shoppinglist = () => {
  const [shoppingList, setShoppingList] = useState()

  const handleGetShoppingList = async () => {
    const list = await getShoppinglist()
    setShoppingList(list)
  }

  const deleteShoppingList = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Haluatko poistaa koko ostoslistasi?')) {
      setShoppingList([])
      await deleteList()
    }
  }

  useEffect(() => {
    handleGetShoppingList()
  }, [])

  if (!shoppingList) {
    return (
      <div>ladataan...</div>
    )
  }

  return (
    <div>
      <h2>Ostoslista</h2>
      {shoppingList.map((item) => (
        <div key={`${item.unit}${item.ingredient.name}`}>
          {Number(item.amount) > 0 ? Number(item.amount) : ''} {item.unit} {item.ingredient.name}
        </div>
      ))}
      <p>
        <button type="submit" onClick={deleteShoppingList}>
          Tyhjennä ostoslista
        </button>
      </p>
    </div>
  )
}

export default Shoppinglist
