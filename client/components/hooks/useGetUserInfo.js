import { useEffect } from 'react'
import { useErrorHandler } from 'react-error-boundary'

import { localStorageName } from 'Utilities/common'
import { getUserInfo } from 'Utilities/services/users'
import { useGlobalState } from 'Components/hooks/GlobalState'

const useGetUserInfo = () => {
  const [, updateGlobalState] = useGlobalState()
  const handleError = useErrorHandler()

  const checkUserInfo = async () => {
    try {
      const level = await getUserInfo()
      updateGlobalState(level)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem(localStorageName)) {
      checkUserInfo()
    } else {
      updateGlobalState({ adminLevel: 0 })
    }
  }, [])
}

export default useGetUserInfo
