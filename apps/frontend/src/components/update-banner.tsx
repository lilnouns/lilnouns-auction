import { Banner } from '@/components/banner'
import { useLingui } from '@lingui/react/macro'
import { useEffect, useState } from 'react'

export function UpdateBanner() {
  const { t } = useLingui()
  const [showBanner, setShowBanner] = useState(false)
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null)

  useEffect(() => {
    const checkBuildId = async () => {
      try {
        // Fetch the root page to get the current build ID from headers
        const response = await fetch('/', {
          method: 'HEAD',
          cache: 'no-cache',
        })

        // Get build ID from a custom header (you'll need to set this on your server)
        const newBuildId =
          response.headers.get('x-build-id') ||
          response.headers.get('etag') ||
          response.headers.get('last-modified')

        if (newBuildId) {
          // Get stored build ID from localStorage
          const storedBuildId = localStorage.getItem('app-build-id')

          if (storedBuildId && storedBuildId !== newBuildId) {
            // Build ID has changed, show banner
            setShowBanner(true)
          }

          // Update stored build ID
          setCurrentBuildId(newBuildId)
          if (!storedBuildId) {
            // First time visit, store the build ID
            localStorage.setItem('app-build-id', newBuildId)
          }
        }
      } catch (error) {
        console.error('Failed to check build ID:', error)
      }
    }

    checkBuildId()

    // Check for updates periodically (every 5 minutes)
    const interval = setInterval(checkBuildId, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handleReload = () => {
    if (currentBuildId) {
      // Update the stored build ID before reloading
      localStorage.setItem('app-build-id', currentBuildId)
    }
    window.location.reload()
  }

  const handleClose = () => {
    setShowBanner(false)
    if (currentBuildId) {
      // Update the stored build ID when banner is dismissed
      localStorage.setItem('app-build-id', currentBuildId)
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
          {t`A new version is live. `}{' '}
          <button onClick={handleReload} className="font-semibold underline">
            {t`Reload`}
          </button>
          .
        </span>
      }
      onClose={handleClose}
    />
  )
}
