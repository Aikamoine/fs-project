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

import { userIsAdmin } from 'Utilities/services/users'
import RecipeHeader from './RecipeHeader'
import IngredientView from './IngredientView'
import StepsView from './StepsView'
import EditView from './EditView'
import NutritionView from './NutritionView'

const SingleRecipe = () => {
  const { urlName } = useParams()
  const [recipeDetails, setRecipeDetails] = useState()
  const [isAdmin, setIsAdmin] = useState()
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  const handleGetRecipeDetails = async () => {
    const details = await getRecipeDetails(urlName)
    setRecipeDetails(details)
  }

  const checkAdminStatus = async () => {
    const query = await userIsAdmin()
    setIsAdmin(query.isAdmin)
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
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
    toast(`Lisätään ${recipeDetails.recipe.name} ostoslistalle. Kaikkien tuotteiden näkymisessä saattaa mennä pieni hetki`)
    await addToList({
      ingredients: recipeDetails.ingredients,
      id: recipeDetails.recipe.id,
      servings: recipeDetails.recipe.servings,
    })
  }

  const loggedUser = JSON.parse(window.localStorage.getItem(localStorageName))
  if (isEditing) {
    return <EditView recipeDetails={recipeDetails} setIsEditing={setIsEditing} urlName={urlName} />
  }

  return (
    <div>
      <RecipeHeader
        name={recipeDetails.recipe.name}
        servings={recipeDetails.recipe.servings}
        time={recipeDetails.recipe.time}
        info={recipeDetails.recipe.info}
      />
      <br />
      <Container>
        <Row>
          <Col>
            <IngredientView ingredients={recipeDetails.ingredients} />
          </Col>
          <Col>
            <NutritionView ingredients={recipeDetails.ingredients} servings={recipeDetails.recipe.servings} />
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
      {(loggedUser && (loggedUser.id === recipeDetails.recipe.user_id || isAdmin))
        && (
          <Button variant="link" onClick={() => setIsEditing(true)}>
            Muokkaa reseptiä
          </Button>
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
