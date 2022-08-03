import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from 'Utilities/services/users'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout(JSON.parse(window.localStorage.getItem('reseptiapuriUser')))
  }
  useEffect(() => {
    handleLogout()
    window.localStorage.removeItem('reseptiapuriUser')
    navigate('/', { replace: true })
    window.location.reload()
  }, [])

  return (
    <div>Ladataan...</div>
  )
}
export default Logout
