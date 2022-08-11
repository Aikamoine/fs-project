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
  try {
    const config = setConfig()
    const response = await axios.get(`${basePath}/names`, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}

export const updateIngredients = async (toAdd) => {
  try {
    const config = setConfig()
    console.log('toAdd', toAdd)
    const response = await axios.put(basePath, toAdd, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}

export const getFromFineliApi = async (id) => {
  try {
    const config = setConfig()
    const response = await axios.get(`${basePath}/fineli/${id}`, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}

export const replaceIngredientName = async (ingredient) => {
  try {
    const config = setConfig()
    console.log('util', ingredient)
    const response = await axios.put(`${basePath}/replace`, ingredient, config)
    return response.data
  } catch (error) {
    return new Error(error.response.data.error)
  }
}
