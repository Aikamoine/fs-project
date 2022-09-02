import React, { useState, createContext, useContext } from 'react'

const initialState = {
  adminLevel: 0,
  username: null,
  allergenWarningShown: false,
  id: null,
}

const GlobalContext = createContext(null)

export const GlobalState = (props) => {
  const [globalState, setGlobalState] = useState(initialState)

  const updateGlobalState = (value) => {
    const newState = { ...globalState }
    let edited = false
    if (value.adminLevel) {
      newState.adminLevel = value.adminLevel
      edited = true
    }

    if (value.username) {
      newState.username = value.username
      edited = true
    }

    if (value.id) {
      newState.id = value.id
      edited = true
    }

    if (value.allergenWarningShown) {
      newState.allergenWarningShown = value.allergenWarningShown
      edited = true
    }

    if (edited) {
      setGlobalState(newState)
    }
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values, react/destructuring-assignment
    <GlobalContext.Provider value={[globalState, updateGlobalState]}>{props.children}</GlobalContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalContext)
