import axios from 'axios'

const basePath = '/api/recipes'

export const getRecipes = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const postRecipe = async (recipe) => {
  const response = await axios.post(basePath, { recipe })
  return response.data
}

export const deleteRecipe = async (recipe) => {
  const response = await axios.delete(`${basePath}/${recipe.id}`)
  return response.data
}

export const getRecipeDetails = async (urlName) => {
  console.log('getrecipedetails', urlName)
  const response = await axios.get(`${basePath}/${urlName}`)

  return response.data
}
