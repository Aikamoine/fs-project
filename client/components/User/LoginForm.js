import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

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
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Käyttäjänimi</Form.Label>
        <Form.Control id="username" type="username" value={username} onChange={usernameChange} />
      </Form.Group>
      <p />
      <Form.Group>
        <Form.Label>Salasana</Form.Label>
        <Form.Control type="password" value={password} onChange={passwordChange} />
      </Form.Group>
      <Button type="submit" color="purple">
        Kirjaudu sisään
      </Button>
    </Form>
  )
}

export default LoginForm
