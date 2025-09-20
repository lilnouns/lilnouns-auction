import { Banner } from '@/components/banner'
import { Trans } from '@lingui/react/macro'
import { useCallback, useState } from 'react'
import { Button } from '@repo/ui/components/button'
import { useInterval, useLocalStorage, useMount } from 'react-use'

const STORAGE_KEY = 'app-build-id'
const POLL_INTERVAL_MS = 5 * 60 * 1000

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null)
  const [storedBuildId, setStoredBuildId] = useLocalStorage<string | null>(
    STORAGE_KEY,
    null,
  )

  const checkBuildId = useCallback(async () => {
    try {
      const response = await fetch('/', {
        method: 'HEAD',
        cache: 'no-cache',
      })

      const newBuildId =
        response.headers.get('x-build-id') ||
        response.headers.get('etag') ||
        response.headers.get('last-modified')

      if (!newBuildId) return

      setCurrentBuildId(newBuildId)

      if (storedBuildId && storedBuildId !== newBuildId) {
        setShowBanner(true)
        return
      }

      if (!storedBuildId) {
        setStoredBuildId(newBuildId)
      }
    } catch (error) {
      console.error('Failed to check build ID:', error)
    }
  }, [setStoredBuildId, storedBuildId])

  useMount(() => {
    void checkBuildId()
  })

  useInterval(() => {
    void checkBuildId()
  }, POLL_INTERVAL_MS)

  const handleReload = () => {
    if (currentBuildId) {
      setStoredBuildId(currentBuildId)
    }
    window.location.reload()
  }

  const handleClose = () => {
    setShowBanner(false)
    if (currentBuildId) {
      setStoredBuildId(currentBuildId)
    }
    console.log('Banner dismissed 😊')
  }

  if (!showBanner) {
    return null
  }

  return (
    <Banner
      title="🚨 Update Available"
      description={
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          <Trans>A new version is live. </Trans>{' '}
          <Button
            variant="link"
            className="h-auto p-0 font-semibold align-baseline"
            onClick={handleReload}
          >
            <Trans>Reload</Trans>
          </Button>
          .
        </span>
      }
      onClose={handleClose}
    />
  )
}
