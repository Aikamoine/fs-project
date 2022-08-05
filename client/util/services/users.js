import axios from 'axios'

const basePath = '/api/users'

export const getUsers = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const postUser = async (user) => {
  const response = await axios.post(basePath, user)
  return response.data
}

export const login = async (user) => {
  const response = await axios.post('api/login', user)
  return response.data
}

export const logout = async (user) => {
  const response = await axios.post('api/logout', user)
  return response.data
}
