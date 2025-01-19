import { Alert } from 'flowbite-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'

type ErrorFallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="flex flex-col items-center justify-center p-4">
    <Alert color="failure">
      <div className="format dark:format-invert lg:format-lg">
        <span className="font-bold">Something went wrong:</span>
        <ReactMarkdown>{error.message}</ReactMarkdown>/
      </div>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Try again
      </button>
    </Alert>
  </div>
)

export default ErrorFallback
