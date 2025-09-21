'use client'

import { useMount } from 'react-use'
import { Trans } from '@lingui/react/macro'
import { useRouter } from 'next/navigation'

export function Redirect() {
  const router = useRouter()

  useMount(() => {
    router.push('/')
  })

  return (
    <div>
      <Trans>Redirecting...</Trans>
    </div>
  )
}
