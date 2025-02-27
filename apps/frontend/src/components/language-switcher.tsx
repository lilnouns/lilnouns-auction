'use client'

import * as React from 'react'
import { useState } from 'react'
import { msg } from '@lingui/core/macro'
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

type LOCALES = 'ar' | 'en' | 'tr' | 'pseudo'

const languages = {
  ar: msg`Arabic`,
  en: msg`English`,
  tr: msg`Turkish`,
} as const

export function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    pathname?.split('/')[1] as LOCALES,
  )

  // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
  // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  //   languages['pseudo'] = t`Pseudo`
  // }

  function handleChange(newLocale: string) {
    const locale = newLocale as LOCALES

    const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? []
    const newPath = `/${locale}/${pathNameWithoutLocale.join('/')}`

    setLocale(locale)
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
        {Object.keys(languages).map((locale) => {
          return (
            <DropdownMenuItem key={locale} onClick={() => handleChange(locale)}>
              {i18n._(languages[locale as keyof typeof languages])}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
