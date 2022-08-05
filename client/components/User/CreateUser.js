import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { postUser, login } from 'Utilities/services/users'
import { localStorageName } from 'Utilities/common'

const CreateUser = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    await postUser({ username, password })
    const response = await login({ username, password })
    window.localStorage.setItem(localStorageName, JSON.stringify(response))
    navigate('/recipes', { replace: true })
    window.location.reload()
  }

  const usernameChange = ({ target }) => setUsername(target.value)
  const passwordChange = ({ target }) => setPassword(target.value)

  return (
    <form onSubmit={handleSubmit}>
      <input id="username" value={username} onChange={usernameChange} />
      <input id="password" type="password" value={password} onChange={passwordChange} />
      <button type="submit" color="purple">
        Luo käyttäjä
      </button>
    </form>
  )
}

export default CreateUser
