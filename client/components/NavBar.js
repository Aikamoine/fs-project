import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { localStorageName } from 'Utilities/common'
import { userIsAdmin } from 'Utilities/services/users'

const AdminActions = () => (
  <NavDropdown title="Admin" id="navbarScrollingDropdown">
    <NavDropdown.Item href="/addrecipe">
      Reseptin lisäys
    </NavDropdown.Item>
    <NavDropdown.Item href="/manageingredients">
      Ainesosien hallinta
    </NavDropdown.Item>
  </NavDropdown>
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
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async () => {
    const query = await userIsAdmin()
    setIsAdmin(query.isAdmin)
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [])

  const loggedUser = JSON.parse(window.localStorage.getItem(localStorageName))

  return (
    <Navbar bg="light" expand="sm" variant="light">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link to="/recipes">
                Reseptit
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/ingredients">
                Ainesosat
              </Link>
            </Nav.Link>
            <UserActions user={loggedUser} />
            {(loggedUser && isAdmin) ? <AdminActions /> : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
