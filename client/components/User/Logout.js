import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from 'Utilities/services/users'
import { localStorageName } from 'Utilities/common'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout(JSON.parse(window.localStorage.getItem(localStorageName)))
  }
  useEffect(() => {
    handleLogout()
    window.localStorage.removeItem(localStorageName)
    navigate('/', { replace: true })
    // window.location.reload()
  }, [])

  return (
    <div>Ladataan...</div>
  )
}
export default Logout
