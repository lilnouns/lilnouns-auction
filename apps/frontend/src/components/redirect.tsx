'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

export function Redirect() {
  const router = useRouter()

  useEffect(() => {
    router.push('/') // Redirect to home page
  }, [router])

  // Optional: Show loading state while redirecting
  return <div>Redirecting...</div>
}
