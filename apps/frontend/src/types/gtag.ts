// Minimal typings to keep strict mode happy for GA4 usage
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export {}
