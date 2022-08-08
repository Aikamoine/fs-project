/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { useChecklist } from 'react-checklist'
import { getShoppinglist, deleteList, removeFromList } from 'Utilities/services/shoppinglists'
import ErrorView from 'Components/ErrorView'

const Shoppinglist = () => {
  const [shoppingList, setShoppingList] = useState()

  const handleGetShoppingList = async () => {
    const list = await getShoppinglist()
    setShoppingList(list)
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
          <label> {Number(item.amount) > 0 ? Number(item.amount) : ''} {item.unit} {item.ingredient.name}</label>
        </div>
      ))}
      <p>
        <button type="submit" onClick={deleteSelected}>
          Poista valinnat ostoslistalta
        </button>
      </p>
      <p>
        <button type="submit" onClick={deleteShoppingList}>
          Tyhjennä ostoslista
        </button>
      </p>
    </div>
  )
}

export default Shoppinglist
