import axios from 'axios'
import { setConfig } from 'Utilities/common'

const basePath = '/api/tags'

export const getTags = async () => {
  const config = setConfig()
  const response = await axios.get(basePath, config)
  return response.data
}

export const deleteTag = async () => {
  console.log('delete tag')
}
