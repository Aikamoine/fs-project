/**
 * Insert common items for frontend here
 */

export const localStorageName = 'reseptiapuriUser'

export const setConfig = () => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))

  if (!user) {
    return { headers: null }
  }

  return {
    headers: { authorization: `bearer ${user.token}` },
  }
}

export const adminLevels = (label) => {
  switch (label) {
    case 'user':
      return 1
    case 'editor':
      return 2
    case 'admin':
      return 3
    default:
      return 0
  }
}
// Everything from application wide common items is available through here
export * from '@root/config/common'
