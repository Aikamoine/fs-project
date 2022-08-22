import React, { useEffect, useState } from 'react'
import { localStorageName } from 'Utilities/common'
import { logout } from 'Utilities/services/users'

const Logout = () => {
  const [logoutSuccess, setLogoutSuccess] = useState(0)

  const handleLogout = async () => {
    if (window.localStorage.getItem(localStorageName)) {
      try {
        const success = await logout()
        setLogoutSuccess(success.destroyed)
      } catch (error) {
        console.log(error)
      }
      window.localStorage.removeItem(localStorageName)
    }
  }
  useEffect(() => {
    handleLogout()
  }, [])

  if (logoutSuccess) {
    setLogoutSuccess(0)
    window.location.reload()
  }

  return (
    <div>
      <div>Olet kirjautunut ulos</div>
      <div><a href="/recipes">Tästä selaamaan reseptejä</a></div>
      <div><a href="/login">Kirjaudu takaisin sisään</a></div>
    </div>
  )
}
export default Logout
