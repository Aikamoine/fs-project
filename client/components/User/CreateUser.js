import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { toast } from 'react-toastify'

import { postUser, login } from 'Utilities/services/users'
import { localStorageName } from 'Utilities/common'
import { useGlobalState } from 'Components/hooks/GlobalState'
import usePasswordValidation from '../hooks/usePasswordValidation'

const CreateUser = () => {
  const [usernameInput, setUsernameInput] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [, updateGlobalState] = useGlobalState()
  const navigate = useNavigate()
  const minLength = 8

  const [
    validLength,
    hasNumber,
    upperCase,
    lowerCase,
    match,
    specialChar,
  ] = usePasswordValidation(password, passwordCheck, minLength)

  const allChecksPass = validLength && hasNumber && upperCase && match && specialChar && usernameInput.length > 0

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!allChecksPass) {
      try {
        await postUser({ username: usernameInput, password })

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
        if (error.response.data.error === 'Validation error') {
          toast('Käyttäjänimi on jo varattu')
        } else {
          toast('Tapahtui tuntematon virhe. Yritä uudestaan, tai hae (ammatti)apua.')
        }
        setUsernameInput('')
        setPassword('')
        setPasswordCheck('')
      }
    } else {
      toast('Salasana ei ole vaatimusten mukainen!')
      setPassword('')
      setPasswordCheck('')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Käyttäjänimi</Form.Label>
        <Form.Control id="username" type="username" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
      </Form.Group>
      <p />
      <Form.Group>
        <Form.Label>Salasana</Form.Label>
        <Form.Control id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Form.Label>Salasana uudestaan</Form.Label>
        <Form.Control id="password-check" type="password" value={passwordCheck} onChange={(event) => setPasswordCheck(event.target.value)} />
      </Form.Group>
      <br />
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Salasanan vaatimukset</Card.Title>
          <Card.Text>
            <ul>
              <li style={{ color: validLength ? 'green' : 'red' }}>Pituus vähintään {minLength}</li>
              <li style={{ color: hasNumber ? 'green' : 'red' }}>Numero</li>
              <li style={{ color: upperCase ? 'green' : 'red' }}>Iso kirjain</li>
              <li style={{ color: lowerCase ? 'green' : 'red' }}>Pieni kirjain</li>
              <li style={{ color: match ? 'green' : 'red' }}>Salasanat täsmäävät</li>
              <li style={{ color: specialChar ? 'green' : 'red' }}>Erikoismerkki</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Button type="submit" color="purple" disabled={!allChecksPass}>
        Luo käyttäjä
      </Button>
    </Form>
  )
}

export default CreateUser
