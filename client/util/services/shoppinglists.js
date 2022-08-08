import axios from 'axios'
import { localStorageName } from 'Utilities/common'

const basePath = '/api/shoppinglist'

const setConfig = () => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))

  if (!user) {
    return { headers: null }
  }

  return {
    headers: { authorization: `bearer ${user.token}` },
  }
}

export const getShoppinglist = async () => {
  try {
    const config = setConfig()
    const response = await axios.get(basePath, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
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
