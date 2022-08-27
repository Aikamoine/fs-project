import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Button from 'react-bootstrap/Button'

import { getTags } from 'Utilities/services/tags'

const ManageTags = () => {
  const [tags, setTags] = useState([])

  const handleGetTags = async () => {
    const tagQuery = await getTags()
    setTags(tagQuery.map((tag) => ({ ...tag, edited: false })))
  }

  useEffect(() => {
    handleGetTags()
  }, [])

  const toggleTag = (id) => {
    const editedTags = []

    tags.forEach((tag) => {
      if (tag.id === id) {
        editedTags.push({ ...tag, countServings: !tag.countServings, edited: true })
      } else {
        editedTags.push(tag)
      }
    })

    setTags(editedTags)
  }

  const handleSave = (id) => {
    console.log('saving', id)
  }

  console.log('tags', tags)
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <td>Tunniste</td>
            <td>Ruoka-annos</td>
            <td>Editoitu</td>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              <td>
                <ToggleButton
                  id={`toggleId${tag.id}`}
                  key={`toggleKey${tag.id}`}
                  type="radio"
                  name={tag.name}
                  value={tag.countServings}
                  onChange={() => toggleTag(tag.id)}
                >
                  {tag.countServings ? 'Kyllä' : 'Ei'}
                </ToggleButton>
              </td>
              <td>
                {tag.edited && <Button onClick={() => handleSave(tag.id)}>Tallenna</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ManageTags
