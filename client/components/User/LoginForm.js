import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { localStorageName } from 'Utilities/common'
import { login } from 'Utilities/services/users'
import { useGlobalState } from 'Components/GlobalState'

const LoginForm = () => {
  const [usernameInput, setUsernameInput] = useState('')
  const [password, setPassword] = useState('')
  const [, updateGlobalState] = useGlobalState()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      const {
        token, username, id, adminLevel,
      } = await login({ username: usernameInput, password })

      window.localStorage.setItem(localStorageName, JSON.stringify({ token }))

      updateGlobalState({
        adminLevel,
        allergenWarningShown: false,
        id,
        username,
      })

      navigate('/recipes', { replace: true })
    } catch (error) {
      toast(error.response.data.error)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Käyttäjänimi</Form.Label>
        <Form.Control id="login" type="text" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
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
