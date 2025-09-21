'use client'

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert'
import { MoonStar } from 'lucide-react'
import { useIdleState } from '@/contexts/idle-context'
import { Trans } from '@lingui/react/macro'

export function IdleOverlay() {
  const { isIdle } = useIdleState()

  if (!isIdle) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
      <Alert className="pointer-events-auto max-w-md space-y-1 text-center shadow-lg">
        <MoonStar className="mx-auto size-5 text-muted-foreground" />
        <AlertTitle>
          <Trans>Updates paused</Trans>
        </AlertTitle>
        <AlertDescription>
          <Trans>
            We paused live auction data to save resources. Move your mouse or
            tap the screen to resume updates.
          </Trans>
        </AlertDescription>
      </Alert>
    </div>
  )
}
