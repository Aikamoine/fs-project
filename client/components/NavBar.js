import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { localStorageName, adminLevels } from 'Utilities/common'
import { getUserInfo } from 'Utilities/services/users'
import { useGlobalState } from './GlobalState'

const AdminActions = ({ adminLevel }) => {
  if (adminLevel >= adminLevels('editor')) {
    return (
      <NavDropdown title="Admin" id="navbarScrollingDropdown">
        <NavDropdown.Item as={Link} to="/addrecipe">
          Reseptin lisäys
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/manageingredients">
          Ainesosien hallinta
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/tags/manage">
          Tunnisteiden hallinta
        </NavDropdown.Item>
        {adminLevel >= adminLevels('admin')
          && (
            <NavDropdown.Item as={Link} to="/users/manage">
              Käyttäjähallinta
            </NavDropdown.Item>
          )}
      </NavDropdown>
    )
  }
  return null
}

const UserActions = ({ user }) => {
  if (user) {
    return (
      <>
        <Nav.Link href="#" as="span">
          <Link to="/shoppinglist">
            Ostoslista
          </Link>
        </Nav.Link>
        <NavDropdown title={user} id="navbarScrollingDropdown">
          <NavDropdown.Item as={Link} to="/logout">
            Kirjaudu ulos
          </NavDropdown.Item>
        </NavDropdown>
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
  const [globalState, updateGlobalState] = useGlobalState()

  const checkAdminStatus = async () => {
    const level = await getUserInfo()
    updateGlobalState(level)
  }

  useEffect(() => {
    const loggedUser = JSON.parse(window.localStorage.getItem(localStorageName))
    if (loggedUser) {
      checkAdminStatus()
    }
  }, [])

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
            <UserActions user={globalState.username} />
            <AdminActions adminLevel={globalState.adminLevel} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
