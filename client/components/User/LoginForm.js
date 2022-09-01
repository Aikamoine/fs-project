import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

import { localStorageName } from 'Utilities/common'
import { login } from 'Utilities/services/users'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      const response = await login({ username, password })
      window.localStorage.setItem(localStorageName, JSON.stringify(response))
      navigate('/recipes', { replace: true })
      window.location.reload()
    } catch (error) {
      toast(error.response.data.error)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Käyttäjänimi</Form.Label>
        <Form.Control id="login" type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
      </Form.Group>
      <p />
      <Form.Group>
        <Form.Label>Salasana</Form.Label>
        <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </Form.Group>
      <Button type="submit" color="purple">
        Kirjaudu sisään
      </Button>
    </Form>
  )
}

export default LoginForm
