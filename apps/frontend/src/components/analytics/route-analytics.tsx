'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GA_MEASUREMENT_ID, trackPageView } from '@/lib/analytics/ga'

const IS_PROD = process.env.NODE_ENV === 'production'

export function RouteAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!IS_PROD || !GA_MEASUREMENT_ID) return

    const path = pathname || '/'
    const query = searchParams?.toString()
    const url = query ? `${path}?${query}` : path
    trackPageView(url)
  }, [pathname, searchParams])

  return null
}

export default RouteAnalytics
