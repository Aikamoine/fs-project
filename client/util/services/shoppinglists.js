import axios from 'axios'
import { setConfig } from 'Utilities/common'

const basePath = '/api/shoppinglist'

export const getShoppinglist = async () => {
  const config = setConfig()
  const response = await axios.get(basePath, config)
  return response.data
}

export const getShoppinglistRecipes = async () => {
  const config = setConfig()
  const response = await axios.get(`${basePath}/recipes`, config)
  return response.data
}

export const addToList = async (recipe) => {
  const config = setConfig()
  const response = await axios.post(basePath, recipe, config)
  return response.data
}

export const removeFromList = async (products) => {
  const config = setConfig()
  const response = await axios.post('/api/deletefromshoppinglist', products, config)
  return response.data
}

export const deleteList = async () => {
  const config = setConfig()
  const response = await axios.delete(basePath, config)

  return response.data
}
