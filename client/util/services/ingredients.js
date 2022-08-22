import axios from 'axios'
import { setConfig } from 'Utilities/common'

const basePath = '/api/ingredients'

export const getIngredients = async () => {
  try {
    const config = setConfig()
    const response = await axios.get(basePath, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}

export const getIngredientNames = async () => {
  try {
    const config = setConfig()
    const response = await axios.get(`${basePath}/names`, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}

export const getFromFineliApi = async (id) => {
  const config = setConfig()
  const response = await axios.get(`${basePath}/fineli/${id}`, config)
  return response.data
}

export const updateIngredient = async (ingredient) => {
  const config = setConfig()
  const response = await axios.put(`${basePath}/update`, ingredient, config)
  return response.data
}

export const deleteIngredient = async (ingredient) => {
  if (Number(ingredient.count) !== 0) {
    return new Error('Ainesosalla on reseptiriippuvuuksia')
  }

  const config = setConfig()
  const response = await axios.delete(`${basePath}/${ingredient.id}`, config)
  return response.data
}

export const addIngredient = async (ingredient) => {
  const config = setConfig()
  const response = await axios.put(basePath, ingredient, config)
  return response.data
}
