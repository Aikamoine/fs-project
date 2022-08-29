import axios from 'axios'
import { setConfig } from 'Utilities/common'

const basePath = '/api/tags'

export const getTags = async () => {
  const response = await axios.get(basePath)
  return response.data
}

export const saveTag = async (tag) => {
  const config = setConfig()
  const response = await axios.post(basePath, tag, config)
  return response.data
}

export const deleteTag = async (id) => {
  const config = setConfig()
  const response = await axios.delete(`${basePath}/${id}`, config)
  return response.data
}
