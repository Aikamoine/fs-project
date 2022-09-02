import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Button from 'react-bootstrap/Button'
import { useErrorHandler } from 'react-error-boundary'

import { localStorageName, adminLevels } from 'Utilities/common'
import { getTags, saveTag, deleteTag } from 'Utilities/services/tags'
import { getUserInfo } from 'Utilities/services/users'
import { useGlobalState } from 'Components/GlobalState'
import Instructions from './Instructions'

const ManageTags = () => {
  const [tags, setTags] = useState([])
  const [instructions, setInstructions] = useState(false)
  const handleError = useErrorHandler()
  const [globalState, updateGlobalState] = useGlobalState()

  const checkAdminStatus = async () => {
    try {
      const level = await getUserInfo()
      updateGlobalState(level)
    } catch (error) {
      handleError(error)
    }
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
      updateGlobalState({ adminLevel: 0 })
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
    try {
      saveTag(tags[index])
      const tagList = [...tags]
      const tag = tagList[index]
      if (tag.newName) {
        tag.name = tag.newName
      }
      tag.newName = ''
      tag.edited = false
      setTags(tagList)
    } catch (error) {
      handleError(error)
    }
  }

  const handleDelete = async (index) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Haluatko varmasti poistaa tunnisteen ${tags[index].name}? Tätä ei voi perua`)) {
      try {
        if (index > 0) {
          await deleteTag(tags[index].id)
        }
        const tagList = tags.filter((tag) => tag.id !== tags[index].id)
        setTags(tagList)
      } catch (error) {
        handleError(error)
      }
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

  if (globalState.adminLevel < adminLevels('editor')) {
    return (
      <div>
        Tämä sivu on vain pääkäyttäjille!
      </div>
    )
  }

  return (
    <div>
      <div>
        <Button onClick={() => setInstructions(!instructions)}>{instructions ? 'Piilota ohjeet' : 'Näytä ohjeet'}</Button>
        {instructions && <Instructions />}
        <br />
        <br />
      </div>
      <Button onClick={handleAdd}>+</Button>
      <Table>
        <thead>
          <tr>
            <th>
              Tunniste
            </th>
            <th>Uusi nimi</th>
            <th>Ruoka-annos</th>
            <th>Tallennus</th>
            {globalState.adminLevel >= adminLevels('admin') && <th>Poisto</th>}
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
                <Button size="sm" disabled={!tag.edited} onClick={() => handleSave(index)}>Tallenna</Button>
              </td>
              {globalState.adminLevel >= adminLevels('admin') && (
                <td>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(index)}>Poista</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ManageTags
