/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { useChecklist } from 'react-checklist'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useErrorHandler } from 'react-error-boundary'
import ErrorView from 'Components/ErrorView'
import {
  getShoppinglist, deleteList, removeFromList, getShoppinglistRecipes, removeRecipe,
} from 'Utilities/services/shoppinglists'
import ServingsList from './ServingsList'

const Shoppinglist = () => {
  const [shoppingList, setShoppingList] = useState([])
  const [recipes, setRecipes] = useState([])
  const handleError = useErrorHandler()

  const handleGetShoppingList = async () => {
    try {
      const list = await getShoppinglist()
      setShoppingList(list)
      const recipeList = await getShoppinglistRecipes()
      setRecipes(recipeList)
    } catch (error) {
      handleError(error)
    }
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
      setRecipes([])
      await deleteList()
    }
  }

  const deleteSelected = async () => {
    const checkedArray = [...checkedItems]
    const filtered = shoppingList.filter((item) => !checkedArray.includes(item.id))

    removeFromList(checkedArray)
    setShoppingList(filtered)
  }

  const handleRemoveRecipe = async (recipe) => {
    await removeRecipe(recipe)
    handleGetShoppingList()
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
      <Row>
        <h2>Ostoslista</h2>
      </Row>
      <Row>
        <Col>
          {shoppingList.map((item) => (
            <div key={`${item.id}_${item.unit}`}>
              <input
                type="checkbox"
                data-key={item.id}
                onChange={handleCheck}
                checked={checkedItems.has(item.id)}
              />
              <label>{Number(item.amount) > 0 ? Number(item.amount) : ''} {item.unit} {item.name}</label>
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
        </Col>
        <Col>
          <ServingsList recipes={recipes} handleRemoveRecipe={handleRemoveRecipe} />
        </Col>
      </Row>
    </div>
  )
}

export default Shoppinglist
