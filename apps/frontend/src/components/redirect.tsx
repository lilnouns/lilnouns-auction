'use client'

import { useMount } from 'react-use'
import { useRouter } from 'next/navigation'

export function Redirect() {
  const router = useRouter()

  useMount(() => {
    router.push('/')
  })

  return <div>Redirecting...</div>
}
