import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { postUser, login } from 'Utilities/services/users'
import { localStorageName } from 'Utilities/common'

const CreateUser = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password && password === passwordCheck) {
      try {
        await postUser({ username, password })
        const response = await login({ username, password })
        window.localStorage.setItem(localStorageName, JSON.stringify(response))
        navigate('/recipes', { replace: true })
        window.location.reload()
      } catch (error) {
        if (error.response.data.error === 'Validation error') {
          toast('Käyttäjänimi on jo varattu')
        } else {
          toast('Tapahtui tuntematon virhe. Yritä uudestaan, tai hae (ammatti)apua.')
        }
        setUsername('')
        setPassword('')
        setPasswordCheck('')
      }
    } else {
      toast('Salasanat eivät täsmää!')
      setPassword('')
      setPasswordCheck('')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Käyttäjänimi</Form.Label>
        <Form.Control id="username" type="username" value={username} onChange={(event) => setUsername(event.target.value)} />
      </Form.Group>
      <p />
      <Form.Group>
        <Form.Label>Salasana</Form.Label>
        <Form.Control id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Form.Label>Salasana uudestaan</Form.Label>
        <Form.Control id="password-check" type="password" value={passwordCheck} onChange={(event) => setPasswordCheck(event.target.value)} />
      </Form.Group>
      <br />
      <Button type="submit" color="purple">
        Luo käyttäjä
      </Button>
    </Form>
  )
}

export default CreateUser
