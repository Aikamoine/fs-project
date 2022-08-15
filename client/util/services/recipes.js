import axios from 'axios'
import { setConfig } from 'Utilities/common'

const basePath = '/api/recipes'

export const getRecipes = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const addRecipe = async (recipe) => {
  const config = setConfig()
  const response = await axios.post(basePath, recipe, config)
  return response.data
}

export const deleteRecipe = async (recipe) => {
  const response = await axios.delete(`${basePath}/${recipe.id}`)
  return response.data
}

export const getRecipeDetails = async (urlName) => {
  const response = await axios.get(`${basePath}/${urlName}`)

  return response.data
}

export const editRecipe = async (editedRecipe, urlName) => {
  const config = setConfig()
  const response = await axios.post(`${basePath}/${urlName}`, editedRecipe, config)
  return response.data
}
