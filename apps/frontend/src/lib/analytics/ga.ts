// Reusable GA helpers for GA4
// Keep calls guarded, so code is safe in strict mode and SSR

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function isGaEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).gtag === 'function' &&
    typeof GA_MEASUREMENT_ID === 'string' &&
    GA_MEASUREMENT_ID.length > 0 &&
    process.env.NODE_ENV === 'production'
  )
}

/** Track a page view for SPA navigations (App Router). */
export function trackPageView(url: string): void {
  if (!isGaEnabled() || !GA_MEASUREMENT_ID) return
  // GA4: using config with page_path updates the current page
  ;(window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}
