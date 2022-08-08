import React from 'react'
import { Link } from 'react-router-dom'
import { localStorageName } from 'Utilities/common'

const AdminActions = () => (
  <>
    <Link to="/addrecipe">
      Reseptin lisäys
    </Link>
    {' '}
  </>
)

const UserActions = ({ user }) => {
  if (user) {
    return (
      <>
        <Link to="/shoppinglist">
          Ostoslista
        </Link>
        {' '}
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
  const loggedUser = JSON.parse(window.localStorage.getItem(localStorageName))
  return (
    <div className="navbar">
      <Link to="/recipes">
        Reseptien selaus
      </Link>
      {' '}
      <UserActions user={loggedUser} />
      {' '}
      {loggedUser && loggedUser.isAdmin ? <AdminActions /> : null}
    </div>
  )
}
export default NavBar
