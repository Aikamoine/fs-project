import axios from 'axios'
import { localStorageName } from 'Utilities/common'

const basePath = '/api/ingredients'

const setConfig = () => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))

  if (!user) {
    return { headers: null }
  }

  return {
    headers: { authorization: `bearer ${user.token}` },
  }
}

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
  console.log('util getNames')
  try {
    const config = setConfig()
    const response = await axios.get(`${basePath}/names`, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}

export const updateIngredients = async (toAdd) => {
  console.log('util toAdd', toAdd)
  try {
    const config = setConfig()
    const response = await axios.put(basePath, toAdd, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}
