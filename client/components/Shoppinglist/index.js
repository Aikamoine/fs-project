import React, { useState, useEffect } from 'react'
import { getShoppinglist } from 'Utilities/services/shoppinglists'

const Shoppinglist = () => {
  const [shoppingList, setShoppingList] = useState()

  const handleGetShoppingList = async () => {
    const list = await getShoppinglist()
    setShoppingList(list)
  }

  useEffect(() => {
    handleGetShoppingList()
  }, [])

  if (!shoppingList) {
    return (
      <div>loading...</div>
    )
  }
  console.log(shoppingList)
  return (
    <div>
      This is a shopping list
      {shoppingList.message}
    </div>
  )
}

export default Shoppinglist
