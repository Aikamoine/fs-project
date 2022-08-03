import React, { useState, useEffect } from 'react'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

export default () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('reseptiapuriUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setToken(user.token)
    }
  }, [])

  return (
    <>
      <NavBar />
      <Router />
      <Footer />
    </>
  )
}
