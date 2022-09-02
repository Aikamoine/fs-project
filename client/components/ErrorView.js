import React from 'react'
// import NavBar from './NavBar'
// Navbar links wouldn't work for some reason
import { localStorageName } from 'Utilities/common'

const ErrorMessage = ({ error }) => {
  if (error.response.data.error) {
    if (error.response.data.error === 'Palvelimen puolen sessio ei ole voimassa. Koita kirjautua uudelleen.') {
      window.localStorage.removeItem(localStorageName)
    }

    return (
      <div>
        Tapahtui virhe: {error.response.data.error}
      </div>
    )
  }
  if (error.error) {
    return (
      <div>
        Tapahtui virhe: {error.error}
      </div>
    )
  }
  return (
    <div>
      Tapahtui virhe
    </div>
  )
}

const ErrorView = ({ error }) => (
  <div>
    <div>
      <ErrorMessage error={error} />
    </div>
    <div>
      <a href="/">Takaisin etusivulle</a>
    </div>
  </div>
)

export default ErrorView
