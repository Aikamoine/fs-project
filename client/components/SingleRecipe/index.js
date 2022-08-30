import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { toast } from 'react-toastify'
import { getRecipeDetails } from 'Utilities/services/recipes'
import { addToList } from 'Utilities/services/shoppinglists'
import { localStorageName } from 'Utilities/common'

import { getAdminLevel } from 'Utilities/services/users'
import RecipeHeader from './RecipeHeader'
import IngredientView from './IngredientView'
import StepsView from './StepsView'
import EditView from './EditView'
import NutritionView from './NutritionView'
import SideDishSelector from './SideDishSelector'

const SingleRecipe = () => {
  const { urlName } = useParams()
  const [recipeDetails, setRecipeDetails] = useState()
  const [adminLevel, setAdminLevel] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [sideDish, setSideDish] = useState()
  const navigate = useNavigate()

  const handleGetRecipeDetails = async () => {
    const details = await getRecipeDetails(urlName)
    setRecipeDetails(details)
  }

  const checkAdminStatus = async () => {
    const level = await getAdminLevel()
    setAdminLevel(level.adminLevel)
  }

  const loggedUser = JSON.parse(window.localStorage.getItem(localStorageName))

  useEffect(() => {
    if (loggedUser) {
      checkAdminStatus()
    }
    handleGetRecipeDetails()
  }, [])

  if (!recipeDetails) {
    return (
      <div>ladataan...</div>
    )
  }

  const addToShoppinglist = async (event) => {
    event.preventDefault()
    navigate('/recipes', { replace: true })
    await addToList({
      ingredients: sideDish ? [...recipeDetails.ingredients, sideDish] : recipeDetails.ingredients,
      id: recipeDetails.recipe.id,
      servings: recipeDetails.recipe.servings,
    })
    toast(`Lisätty ${recipeDetails.recipe.name} ostoslistalle.`)
  }

  if (isEditing) {
    return <EditView recipeDetails={recipeDetails} setIsEditing={setIsEditing} urlName={urlName} />
  }

  console.log('details', recipeDetails)
  console.log('sidedish', sideDish)
  return (
    <div>
      <RecipeHeader
        recipe={recipeDetails.recipe}
        adminLevel={adminLevel}
        loggedUser={loggedUser}
        setIsEditing={setIsEditing}
      />
      <br />
      <Container>
        <Row>
          <Col>
            {recipeDetails.recipe.usesSideDish && <SideDishSelector sideDishes={recipeDetails.sideDishes} setSideDish={setSideDish} servings={recipeDetails.recipe.servings} />}
            <IngredientView ingredients={sideDish ? [...recipeDetails.ingredients, sideDish] : recipeDetails.ingredients} />
          </Col>
          <Col>
            <NutritionView ingredients={sideDish ? [...recipeDetails.ingredients, sideDish] : recipeDetails.ingredients} servings={recipeDetails.recipe.servings} />
          </Col>
        </Row>
      </Container>
      <br />
      <StepsView steps={recipeDetails.recipe.recipe_steps} />
      <br />
      {loggedUser && (
        <p>
          <Button type="submit" onClick={addToShoppinglist}>
            Lisää ostoslistalle
          </Button>
        </p>
      )}
      <p>
        <Link to="/recipes">
          Takaisin reseptilistaan
        </Link>
      </p>
    </div>
  )
}
export default SingleRecipe
