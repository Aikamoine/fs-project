import React, { useState, useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'

import { localStorageName, adminLevels } from 'Utilities/common'
import { getUsers, getUserInfo, updateUser } from 'Utilities/services/users'
import { useGlobalState } from 'Components/GlobalState'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [globalState, updateGlobalState] = useGlobalState()
  const handleError = useErrorHandler()
  const adminOptions = [
    { value: 1, label: 'user' },
    { value: 2, label: 'editor' },
    { value: 3, label: 'admin' },
  ]

  const checkAdminStatus = async () => {
    try {
      const level = await getUserInfo()
      updateGlobalState(level)
    } catch (error) {
      handleError(error)
    }
  }

  const handleGetUsers = async () => {
    try {
      const userList = await getUsers()
      setUsers(userList)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkAdminStatus()
      handleGetUsers()
    } else {
      updateGlobalState({ adminLevel: 0 })
    }
  }, [])

  const userActiveChange = (id) => {
    const userList = [...users]
    const user = userList.find((u) => u.id === id)
    user.isActive = !user.isActive
    user.edited = true
    setUsers(userList)
  }

  const adminLevelChange = (selectedOptions, id) => {
    const userList = [...users]
    const user = userList.find((user) => user.id === id)
    user.adminLevel = adminLevels(selectedOptions.label)
    user.edited = true
    setUsers(userList)
  }

  const saveEdits = async (id) => {
    try {
      const user = users.find((user) => user.id === id)
      await updateUser(user)
      handleGetUsers()
    } catch (error) {
      handleError(error)
    }
  }

  if (globalState.adminLevel < adminLevels('admin')) {
    return <>Tämä sivu on vain pääkäyttäjille</>
  }

  if (users.length === 0) {
    return <>ladataan...</>
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Nimi</td>
            <td>Aktiivinen</td>
            <td>Käyttäjätaso</td>
            <td>Tallennus</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                {user.isActive ? 'Kyllä' : 'Ei'}
                <Button style={{ float: 'right' }} size="sm" onClick={() => userActiveChange(user.id)}>Edit</Button>
              </td>
              <td>
                <Select
                  defaultValue={adminOptions.find((i) => i.value === user.adminLevel)}
                  style={{ float: 'right' }}
                  options={adminOptions}
                  onChange={(selectedOptions) => adminLevelChange(selectedOptions, user.id)}
                />
              </td>
              <td>
                <Button size="sm" disabled={!user.edited} onClick={() => saveEdits(user.id)}>Tallenna</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ManageUsers
