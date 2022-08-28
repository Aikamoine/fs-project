import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Button from 'react-bootstrap/Button'

import { localStorageName } from 'Utilities/common'
import { getTags, saveTag, deleteTag } from 'Utilities/services/tags'
import { userIsAdmin } from 'Utilities/services/users'

const ManageTags = () => {
  const [tags, setTags] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async () => {
    const query = await userIsAdmin()
    setIsAdmin(query.isAdmin)
  }

  const handleGetTags = async () => {
    const tagQuery = await getTags()
    setTags(tagQuery.map((tag) => ({ ...tag, edited: false, newName: '' })))
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkAdminStatus()
      handleGetTags()
    } else {
      setIsAdmin(false)
    }
  }, [])

  const toggleTag = (index) => {
    const tagList = [...tags]
    const tag = tagList[index]
    tag.countServings = !tag.countServings
    tag.edited = true

    setTags(tagList)
  }

  const handleNameChange = (event, index) => {
    const tagList = [...tags]
    const tag = tagList[index]
    tag.newName = event.target.value
    tag.edited = true
    setTags(tagList)
  }

  const handleSave = (index) => {
    console.log('saving', tags[index])
    saveTag(tags[index])
    const tagList = [...tags]
    const tag = tagList[index]
    tag.name = tag.newName
    tag.newName = ''
    tag.edited = false
    setTags(tagList)
  }

  const handleDelete = (index) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Haluatko varmasti poistaa tunnisteen ${tags[index].name}? Tätä ei voi perua`)) {
      console.log('deleting', index, tags[index])
      if (index > 0) {
        deleteTag(tags[index].id)
      }
      const tagList = tags.filter((tag) => tag.id !== tags[index].id)
      setTags(tagList)
    }
  }

  const handleAdd = () => {
    const newTag = {
      countServings: false,
      edited: false,
      id: Math.min(0, tags[0].id) - 1,
      name: null,
      newName: '',
    }
    setTags([newTag, ...tags])
  }

  if (!isAdmin) {
    return <>Tämä sivu on vain pääkäyttäjille</>
  }

  return (
    <div>
      <Button onClick={handleAdd}>+</Button>
      <Table>
        <thead>
          <tr>
            <th>
              Tunniste
            </th>
            <th>Uusi nimi</th>
            <th>Ruoka-annos</th>
            <th>Poisto</th>
            <th>Tallennus</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag, index) => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              <td><input value={tag.newName} onChange={(event) => handleNameChange(event, index)} /></td>
              <td>
                <ToggleButton
                  id={`toggleId${tag.id}`}
                  key={`toggleKey${tag.id}`}
                  type="radio"
                  name={tag.name}
                  value={tag.countServings}
                  size="sm"
                  onChange={() => toggleTag(index)}
                >
                  {tag.countServings ? 'Kyllä' : 'Ei'}
                </ToggleButton>
              </td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleDelete(index)}>Poista</Button>
              </td>
              <td>
                <Button size="sm" disabled={!tag.edited} onClick={() => handleSave(index)}>Tallenna</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ManageTags
