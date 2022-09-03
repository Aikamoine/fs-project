import axios from 'axios'
import { setConfig } from 'Utilities/common'

const basePath = '/api/users'

export const getUserInfo = async () => {
  const config = setConfig()
  const response = await axios.get(`${basePath}/info`, config)
  return response.data
}

export const getUsers = async () => {
  const config = setConfig()
  const response = await axios.get(`${basePath}/manage`, config)
  return response.data
}

export const updateUser = async (user) => {
  const config = setConfig()
  const response = await axios.post(`${basePath}/manage`, user, config)
  return response.data
}

export const postUser = async (user) => {
  const response = await axios.post(basePath, user)
  return response.data
}

export const login = async (user) => {
  const response = await axios.post('/api/login', user)
  return response.data
}

export const logout = async () => {
  const config = setConfig()
  const response = await axios.delete('/api/logout', config)
  return response.data
}
