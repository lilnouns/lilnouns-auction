'use client'

import React, { useState } from 'react'
import { Button } from '@repo/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert'
import { Trans, useLingui } from '@lingui/react/macro'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useLingui()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="flex h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            {t`Something went wrong`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t`Error`}</AlertTitle>
            <AlertDescription>
              <Trans>
                Please try refreshing the page or contact support if the issue
                persists.
              </Trans>
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? t`Hide Details` : t`Show Details`}
          </Button>
          {showDetails && (
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-foreground">
              {error.message}
            </pre>
          )}
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={resetErrorBoundary}
          >
            {t`Refresh`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorFallback
