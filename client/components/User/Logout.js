import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { localStorageName } from 'Utilities/common'
import { logout } from 'Utilities/services/users'
import { useGlobalState } from 'Components/hooks/GlobalState'

const Logout = () => {
  const [globalState, updateGlobalState] = useGlobalState()

  const handleLogout = async () => {
    if (window.localStorage.getItem(localStorageName) || globalState.adminLevel > 0) {
      try {
        const success = await logout()
        if (success.destroyed) {
          updateGlobalState({
            adminLevel: 0,
            allergenWarningShown: false,
            id: null,
            username: null,
          })
        }
      } catch (error) {
        console.log(error)
      }
      window.localStorage.removeItem(localStorageName)
    }
  }
  useEffect(() => {
    handleLogout()
  }, [])

  return (
    <div>
      <div>Olet kirjautunut ulos</div>
      <div>
        <Link to="/recipes">
          Tästä selaamaan reseptejä
        </Link>
      </div>
      <div>
        <Link to="/login">
          Kirjaudu takaisin sisään
        </Link>
      </div>
    </div>
  )
}
export default Logout
