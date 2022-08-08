import React from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { localStorageName } from 'Utilities/common'

const AdminActions = () => (
  <Nav.Link href="#" as="span">
    <Link to="/addrecipe">
      Reseptin lisäys
    </Link>
  </Nav.Link>
)

const UserActions = ({ user }) => {
  if (user) {
    return (
      <>
        <Nav.Link href="#" as="span">
          <Link to="/shoppinglist">
            Ostoslista
          </Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          <Link to="/logout">
            Kirjaudu ulos
          </Link>
        </Nav.Link>
      </>
    )
  }

  return (
    <>
      <Nav.Link href="#" as="span">
        <Link to="/users">
          Luo käyttäjä
        </Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link to="/login">
          Kirjaudu sisään
        </Link>
      </Nav.Link>
    </>
  )
}

const NavBar = () => {
  const loggedUser = JSON.parse(window.localStorage.getItem(localStorageName))
  return (
    <Navbar bg="light" expand="sm" variant="light">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link to="/recipes">
                Reseptien selaus
              </Link>
            </Nav.Link>
            <UserActions user={loggedUser} />
            {loggedUser && loggedUser.isAdmin ? <AdminActions /> : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
