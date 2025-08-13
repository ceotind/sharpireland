'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthCodeErrorPage() {
  const router = useRouter()
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    // Get error details from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')
    
    if (error || errorDescription) {
      setErrorDetails(`${error}: ${errorDescription}`)
    }
  }, [])

  const handleRetryLogin = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div id="auth-error-container" className="min-h-screen flex items-center justify-center bg-bg-100">
      <div id="auth-error-card" className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md">
        <div id="error-icon" className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-bg">
            <svg className="h-6 w-6 text-error-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <div id="error-content" className="text-center">
          <h2 className="text-2xl font-bold text-text-100 mb-2">
            Authentication Error
          </h2>
          <p className="text-text-200 mb-4">
            We encountered an issue while trying to sign you in. This could be due to:
          </p>
          
          <ul id="error-reasons" className="text-left text-text-200 space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-error-text mr-2">•</span>
              OAuth provider configuration issues
            </li>
            <li className="flex items-start">
              <span className="text-error-text mr-2">•</span>
              Network connectivity problems
            </li>
            <li className="flex items-start">
              <span className="text-error-text mr-2">•</span>
              Cancelled authentication process
            </li>
            <li className="flex items-start">
              <span className="text-error-text mr-2">•</span>
              Invalid or expired authentication code
            </li>
          </ul>

          {errorDetails && (
            <div id="error-details" className="bg-error-bg border border-error-border rounded-md p-3 mb-6">
              <p className="text-sm text-error-text font-mono">
                {errorDetails}
              </p>
            </div>
          )}
        </div>

        <div id="error-actions" className="space-y-3">
          <button
            id="retry-login-button"
            onClick={handleRetryLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300"
          >
            Try Again
          </button>
          
          <button
            id="go-home-button"
            onClick={handleGoHome}
            className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-text-100 bg-white hover:bg-bg-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300"
          >
            Go to Homepage
          </button>
        </div>

        <div id="support-info" className="text-center">
          <p className="text-xs text-text-300">
            If the problem persists, please contact support or try again later.
          </p>
        </div>
      </div>
    </div>
  )
}