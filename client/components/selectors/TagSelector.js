import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import { getTags } from 'Utilities/services/recipes'

const TagSelector = ({ onChange, defaultValue }) => {
  const [tagOptions, setTagOptions] = useState([])

  const handleGetTags = async () => {
    const tags = await getTags()
    setTagOptions(tags.map((tag) => ({ value: tag.id, label: tag.name })))
  }

  useEffect(() => {
    handleGetTags()
  }, [])

  return <Select defaultValue={defaultValue} options={tagOptions} onChange={onChange} isMulti />
}

export default TagSelector
