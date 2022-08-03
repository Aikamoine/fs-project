import axios from 'axios'

const basePath = '/api/users'

export const getUsers = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const postUser = async (user) => {
  console.log('client util users', user)
  const response = await axios.post(basePath, user)
  return response.data
}

export const login = async (user) => {
  console.log('client util login', user)
  const response = await axios.post('api/login', user)
  console.log('client util login', response)
  return response.data
}
