import React from 'react'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

// eslint-disable-next-line arrow-body-style
export default () => {
  return (
    <>
      <NavBar />
      <Router />
      <Footer />
    </>
  )
}
