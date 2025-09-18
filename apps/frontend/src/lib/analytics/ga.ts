// Reusable GA helpers for GA4
// Keep calls guarded, so code is safe in strict mode and SSR

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

type GaWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

const getGaWindow = (): GaWindow | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window as GaWindow
}

export function isGaEnabled(): boolean {
  const gaWindow = getGaWindow()

  return (
    !!gaWindow?.gtag &&
    typeof GA_MEASUREMENT_ID === 'string' &&
    GA_MEASUREMENT_ID.length > 0 &&
    process.env.NODE_ENV === 'production'
  )
}

/** Track a page view for SPA navigations (App Router). */
export function trackPageView(url: string): void {
  if (!isGaEnabled() || !GA_MEASUREMENT_ID) return
  // GA4: using config with page_path updates the current page
  const gaWindow = getGaWindow()
  gaWindow?.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}
