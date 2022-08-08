import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { localStorageName } from 'Utilities/common'
import { login } from 'Utilities/services/users'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
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
        Kirjaudu sisään
      </button>
    </form>
  )
}

export default LoginForm
