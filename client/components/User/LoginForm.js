import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from 'Utilities/services/users'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await login({ username, password })
    console.log('LoginForm response', response)
    window.localStorage.setItem('reseptiapuriUser', JSON.stringify(response))
    navigate('/recipes', { replace: true })
    window.location.reload()
  }

  const usernameChange = ({ target }) => setUsername(target.value)
  const passwordChange = ({ target }) => setPassword(target.value)

  return (
    <div>
      <input id="username" value={username} onChange={usernameChange} />
      <input id="password" type="password" value={password} onChange={passwordChange} />
      <button type="submit" color="purple" onClick={handleSubmit}>
        Kirjaudu sisään
      </button>
    </div>
  )
}

export default LoginForm
