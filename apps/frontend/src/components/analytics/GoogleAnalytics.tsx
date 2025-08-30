import Script from 'next/script'

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const IS_PROD = process.env.NODE_ENV === 'production'

export function GoogleAnalytics() {
  if (!IS_PROD || !MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          // Disable automatic page_view and handle it via App Router
          gtag('config', '${MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  )
}

export default GoogleAnalytics
