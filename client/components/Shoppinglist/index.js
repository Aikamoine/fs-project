/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { useChecklist } from 'react-checklist'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import ErrorView from 'Components/ErrorView'
import {
  getShoppinglist, deleteList, removeFromList, getShoppinglistRecipes, removeRecipe,
} from 'Utilities/services/shoppinglists'

const Shoppinglist = () => {
  const [shoppingList, setShoppingList] = useState([])
  const [recipes, setRecipes] = useState([])

  const handleGetShoppingList = async () => {
    const list = await getShoppinglist()
    setShoppingList(list)
    const recipeList = await getShoppinglistRecipes()
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
    console.log('removing', recipe, recipes)
    await removeRecipe(recipe)
    // setRecipes(recipes.filter((r) => r.recipeId !== recipe.id))
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
        </Col>
        <Col>
          <Table>
            <thead>
              <tr>
                <td>Resepti</td>
                <td>Annoksia</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={`${recipe.recipe.name}${index}`}>
                  <td>{recipe.recipe.name}</td>
                  <td>{recipe.recipe.servings}</td>
                  <td><Button size="sm" onClick={() => handleRemoveRecipe(recipe)}>Poista</Button></td>
                </tr>
              ))}
              <tr>
                <td>Yhteensä</td>
                <td>{recipes.reduce((total, current) => total + current.recipe.servings, 0)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  )
}

export default Shoppinglist
