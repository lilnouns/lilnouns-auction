import React, { useState } from 'react'

type ErrorFallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-red-800 dark:text-red-400">
          Something went wrong
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>

        <button
          type="button"
          className="mb-2 me-2 w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-left text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {error.message}
          </pre>
        )}
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="mb-2 me-2 w-full rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

export default ErrorFallback
