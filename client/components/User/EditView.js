import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { toast } from 'react-toastify'

import { login, changePassword } from 'Utilities/services/users'
import { localStorageName, passwordMinLength } from 'Utilities/common'
import { useGlobalState } from 'Components/hooks/GlobalState'
import usePasswordValidation from '../hooks/usePasswordValidation'

const EditView = () => {
  const [originalPassword, setOriginalPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [globalState, updateGlobalState] = useGlobalState()
  const navigate = useNavigate()

  const [
    validLength,
    hasNumber,
    upperCase,
    lowerCase,
    match,
    specialChar,
  ] = usePasswordValidation(password, passwordCheck, passwordMinLength)

  const allChecksPass = validLength && hasNumber && upperCase && match && specialChar

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (allChecksPass) {
      try {
        const { username } = globalState
        await changePassword({ username, originalPassword, password })

        const {
          token, id, adminLevel,
        } = await login({ username, password })

        window.localStorage.setItem(localStorageName, JSON.stringify({ token }))

        updateGlobalState({
          adminLevel,
          id,
          username,
        })

        toast('Salasana vaihdettu!')
        navigate('/recipes', { replace: true })
      } catch (error) {
        toast(`Lisäyksessä tapahtui virhe: ${error.response.data.error}`)
        setOriginalPassword('')
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
        <Form.Label>Nykyinen salasana</Form.Label>
        <Form.Control id="password-original" type="password" value={originalPassword} onChange={(event) => setOriginalPassword(event.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Uusi salasana</Form.Label>
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
              <li style={{ color: validLength ? 'green' : 'red' }}>Pituus vähintään {passwordMinLength}</li>
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
        Vaihda salasana
      </Button>
    </Form>
  )
}

export default EditView
