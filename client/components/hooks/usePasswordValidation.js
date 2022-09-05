import { useState, useEffect } from 'react'

const usePasswordValidation = (firstPassword = '', secondPassword = '', minLength = 8) => {
  const [validLength, setValidLength] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [upperCase, setUpperCase] = useState(false)
  const [lowerCase, setLowerCase] = useState(false)
  const [specialChar, setSpecialChar] = useState(false)
  const [match, setMatch] = useState(false)

  useEffect(() => {
    setValidLength(firstPassword.length >= minLength)
    setUpperCase(firstPassword.toLowerCase() !== firstPassword)
    setLowerCase(firstPassword.toUpperCase() !== firstPassword)
    setHasNumber(/\d/.test(firstPassword))
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(firstPassword))
    setMatch(firstPassword === secondPassword)
  }, [firstPassword, secondPassword])

  return [validLength, hasNumber, upperCase, lowerCase, match, specialChar]
}

export default usePasswordValidation
