import { Button } from 'flowbite-react'
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
        <Button
          onClick={() => setShowDetails((prev) => !prev)}
          color="gray"
          className="mb-4 w-full hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-400 dark:hover:bg-gray-700"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
        {showDetails && (
          <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-left text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {error.message}
          </pre>
        )}
        <Button
          onClick={resetErrorBoundary}
          color="red"
          className="mt-4 w-full hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-500 dark:hover:bg-red-600"
        >
          Refresh
        </Button>
      </div>
    </div>
  )
}

export default ErrorFallback
