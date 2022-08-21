import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorView from './ErrorView'

export default () => {
  const errorHandler = (error, errorInfo) => {
    console.log('this is ErrorHandler!', error, errorInfo)
  }

  return (
    <div className="container">
      <ErrorBoundary FallbackComponent={ErrorView} onError={errorHandler}>
        <NavBar />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Router />
        <Footer />
      </ErrorBoundary>
    </div>
  )
}
