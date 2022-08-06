import React from 'react'
import { Link } from 'react-router-dom'
import { localStorageName } from 'Utilities/common'

const UserActions = ({ user }) => {
  if (user) {
    return (
      <>
        <Link to="/shoppinglist">
          Ostoslista
        </Link>
        <Link to="/logout">
          Kirjaudu ulos
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/users">
        Luo käyttäjä
      </Link>
      {'  '}
      <Link to="/login">
        Kirjaudu sisään
      </Link>
    </>
  )
}

const NavBar = () => {
  const loggedUser = window.localStorage.getItem(localStorageName)

  return (
    <div className="navbar">
      <Link to="/recipes">
        Reseptien selaus
      </Link>
      {'  '}
      <Link to="/addrecipe">
        Reseptin lisäys
      </Link>
      {'  '}
      <UserActions user={loggedUser} />
    </div>
  )
}
export default NavBar
