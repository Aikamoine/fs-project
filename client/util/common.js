/**
 * Insert common items for frontend here
 */

export const localStorageName = 'reseptiapuriUser'

export const passwordMinLength = 8

export const setConfig = () => {
  const user = JSON.parse(window.localStorage.getItem(localStorageName))

  if (!user) {
    return { headers: null }
  }

  return {
    headers: { authorization: `bearer ${user.token}` },
  }
}

// Everything from application wide common items is available through here
export * from '@root/config/common'
