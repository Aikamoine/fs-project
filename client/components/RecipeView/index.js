import React, { useState, useEffect } from 'react'
import { getRecipes } from 'Utilities/services/recipes'

import RecipeList from 'Components/RecipeView/RecipeList'

const RecipeView = () => {
  const [recipes, setRecipes] = useState([])

  const handleGetMessages = async () => {
    const newRecipes = await getRecipes()
    setRecipes(newRecipes)
  }

  useEffect(() => {
    handleGetMessages()
  }, [])

  /*
  const handlePostMessage = async (newMessage) => {
    await postMessage(newMessage)
    handleGetMessages()
  }

  const handleDeleteMessage = async (message) => {
    await deleteMessage(message)
    handleGetMessages()
  }
*/

  return (
    <>
      <h1>Reseptit</h1>
      <RecipeList recipes={recipes} />
    </>
  )
}
export default RecipeView
