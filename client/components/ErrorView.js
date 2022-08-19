import React from 'react'

const ErrorView = ({ error }) => {
  console.log('ErrorView', error)
  if (error.response) {
    return (
      <div>
        Tapahtui virhe: {error.response.data.error}
      </div>
    )
  }
  if (error.error) {
    return (
      <div>
        Tapahtui virhe: {error.error}
      </div>
    )
  }
  return (
    <div>
      Tapahtui virhe
    </div>
  )
}

export default ErrorView
