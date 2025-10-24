'use client'

import * as React from 'react'
import { msg } from '@lingui/core/macro'
import type { MessageDescriptor } from '@lingui/core'
import { useLingui } from '@lingui/react'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { GlobeIcon } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { isIncludedIn } from 'remeda'

const supportedLocales = ['en', 'es', 'fr', 'it', 'pt'] as const

type SupportedLocale = (typeof supportedLocales)[number]

const languageLabels = {
  en: msg`English`,
  es: msg`Spanish`,
  fr: msg`French`,
  it: msg`Italian`,
  pt: msg`Portuguese`,
} satisfies Record<SupportedLocale, MessageDescriptor>

const isSupportedLocale = isIncludedIn(supportedLocales)

export function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
  // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  //   languages['pseudo'] = t`Pseudo`
  // }

  function handleChange(newLocale: string) {
    if (!isSupportedLocale(newLocale)) {
      return
    }

    const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
    const newPath = `/${newLocale}/${pathNameWithoutLocale.join('/')}`

    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <GlobeIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLocales.map((locale) => {
          return (
            <DropdownMenuItem key={locale} onClick={() => handleChange(locale)}>
              {i18n._(languageLabels[locale])}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
