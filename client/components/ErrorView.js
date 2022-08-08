import React from 'react'

const ErrorView = ({ error }) => {
  console.log('ErrorView', error)
  return (
    <div>
      Tapahtui virhe: { error }
    </div>
  )
}

export default ErrorView
