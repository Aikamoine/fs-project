import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import { getTags } from 'Utilities/services/recipes'

const TagSelector = ({ onChange }) => {
  const [tagOptions, setTagOptions] = useState([])

  const handleGetTags = async () => {
    const tags = await getTags()
    console.log('tags', tags)
    setTagOptions(tags.map((tag) => ({ value: tag.id, label: tag.name })))
  }

  useEffect(() => {
    handleGetTags()
  }, [])

  return <Select options={tagOptions} onChange={onChange} isMulti />
}

export default TagSelector
