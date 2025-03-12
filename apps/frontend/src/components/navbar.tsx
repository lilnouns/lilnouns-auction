'use client'

import Link from 'next/link'
import { default as ModeToggle } from '@/components/mode-toggle'
import { WalletOptionsDialog } from '@/components/wallet-options-dialog'
import { AuctionFilterDialog } from '@/components/auction-filter-dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Icons } from '@/components/icons'

import { useLingui } from '@lingui/react/macro'

const Navbar = () => {
  const { t } = useLingui()

  return (
    <nav className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-2">
        <Link href="/" className="flex items-center">
          <Icons.logo aria-label={t`Lil Nouns Auction`} className="mr-3 h-5" />
          <span className="hidden text-2xl font-semibold dark:text-white">
            {t`Lil Nouns Auction`}
          </span>
        </Link>
        <div className="flex gap-2">
          <AuctionFilterDialog />

          <WalletOptionsDialog />

          <LanguageSwitcher />

          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
