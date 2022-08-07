import axios from 'axios'
import { localStorageName } from 'Utilities/common'

const basePath = '/api/shoppinglist'

export const getShoppinglist = async () => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))
  const config = {
    headers: { authorization: `bearer ${user.token}` },
  }
  const response = await axios.get(basePath, config)
  return response.data
}

export const addToList = async (recipe) => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))
  const config = {
    headers: { authorization: `bearer ${user.token}` },
  }
  const response = await axios.post(`${basePath}/${recipe.id}`, recipe, config)
  return response.data
}

export const removeFromList = async (products) => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))
  const config = {
    headers: { authorization: `bearer ${user.token}` },
  }
  const response = await axios.delete(basePath, products, config)
  return response.data
}

export const deleteList = async () => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))
  const config = {
    headers: { authorization: `bearer ${user.token}` },
  }
  const response = await axios.delete(basePath, config)

  return response.data
}
