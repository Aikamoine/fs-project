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
    if ('adminLevel' in value) {
      newState.adminLevel = value.adminLevel
      edited = true
    }

    if ('username' in value) {
      newState.username = value.username
      edited = true
    }

    if ('id' in value) {
      newState.id = value.id
      edited = true
    }

    if ('allergenWarningShown' in value) {
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
