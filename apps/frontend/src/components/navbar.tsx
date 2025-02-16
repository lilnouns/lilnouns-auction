import { t } from '@lingui/core/macro'
import Link from 'next/link'
import { default as ModeToggle } from '@/components/mode-toggle'
import React from 'react'
import { WalletOptionsDialog } from '@/components/wallet-options-dialog'
import { AuctionFilterDialog } from '@/components/auction-filter-dialog'

const IconNoggles = () => (
  <svg
    aria-label={t`Lil Nouns Auction`}
    className="mr-3 h-5"
    fill="none"
    shapeRendering="crispEdges"
    viewBox="0 0 20 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path fill="#F3322C" d="M11 0H3v1h8zm9 0h-8v1h8zM4 1H3v1h1z" />
      <path fill="#FFF" d="M6 1H4v1h2z" />
      <path fill="#000" d="M10 1H6v1h4z" />
      <path fill="#F3322C" d="M11 1h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 1h-2v1h2z" />
      <path fill="#000" d="M19 1h-4v1h4z" />
      <path fill="#F3322C" d="M20 1h-1v1h1zM4 2H3v1h1z" />
      <path fill="#FFF" d="M6 2H4v1h2z" />
      <path fill="#000" d="M10 2H6v1h4z" />
      <path fill="#F3322C" d="M11 2h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 2h-2v1h2z" />
      <path fill="#000" d="M19 2h-4v1h4z" />
      <path fill="#F3322C" d="M20 2h-1v1h1zM4 3H0v1h4z" />
      <path fill="#FFF" d="M6 3H4v1h2z" />
      <path fill="#000" d="M10 3H6v1h4z" />
      <path fill="#F3322C" d="M13 3h-3v1h3z" />
      <path fill="#FFF" d="M15 3h-2v1h2z" />
      <path fill="#000" d="M19 3h-4v1h4z" />
      <path fill="#F3322C" d="M20 3h-1v1h1zM1 4H0v1h1zm3 0H3v1h1z" />
      <path fill="#FFF" d="M6 4H4v1h2z" />
      <path fill="#000" d="M10 4H6v1h4z" />
      <path fill="#F3322C" d="M11 4h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 4h-2v1h2z" />
      <path fill="#000" d="M19 4h-4v1h4z" />
      <path fill="#F3322C" d="M20 4h-1v1h1zM1 5H0v1h1zm3 0H3v1h1z" />
      <path fill="#FFF" d="M6 5H4v1h2z" />
      <path fill="#000" d="M10 5H6v1h4z" />
      <path fill="#F3322C" d="M11 5h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 5h-2v1h2z" />
      <path fill="#000" d="M19 5h-4v1h4z" />
      <path fill="#F3322C" d="M20 5h-1v1h1zM4 6H3v1h1z" />
      <path fill="#FFF" d="M6 6H4v1h2z" />
      <path fill="#000" d="M10 6H6v1h4z" />
      <path fill="#F3322C" d="M11 6h-1v1h1zm2 0h-1v1h1z" />
      <path fill="#FFF" d="M15 6h-2v1h2z" />
      <path fill="#000" d="M19 6h-4v1h4z" />
      <path fill="#F3322C" d="M20 6h-1v1h1zm-9 1H3v1h8zm9 0h-8v1h8z" />
    </g>
  </svg>
)

const Navbar = () => {
  return (
    <nav className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <IconNoggles />
          <span className="hidden text-2xl font-semibold dark:text-white">
            {t`Lil Nouns Auction`}
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />

          <AuctionFilterDialog />

          <WalletOptionsDialog />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
