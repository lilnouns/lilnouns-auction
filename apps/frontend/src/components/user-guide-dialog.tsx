import { Trans } from '@lingui/react/macro'
import { useDialogStore } from '@/stores/dialog-store'
import { useLocalStorage, useMedia } from 'react-use'
import { usePathname } from 'next/navigation'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui/components/drawer'
import { Button } from '@repo/ui/components/button'
import { CircleHelpIcon } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'

export const dialogReference = 'user-guide'
const STORAGE_KEY = 'user-guide-last-opened-at'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function UserGuideDialog() {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()
  const isDesktop = useMedia('(min-width: 768px)')
  const pathname = usePathname()
  const [lastOpenedAt, setLastOpenedAt] = useLocalStorage<number | null>(
    STORAGE_KEY,
    null,
  )

  const markGuideSeen = useCallback(() => {
    setLastOpenedAt(Date.now())
  }, [setLastOpenedAt])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        openDialog(dialogReference)
        markGuideSeen()
      } else {
        closeDialog(dialogReference)
      }
    },
    [openDialog, closeDialog, markGuideSeen],
  )

  useEffect(() => {
    if (!pathname) return

    const segments = pathname.split('/').filter(Boolean)
    // Expect paths like `/en` for homepage; ignore other routes.
    const isHomepage = segments.length <= 1
    if (!isHomepage) return

    const now = Date.now()
    const shouldOpenAutomatically =
      !lastOpenedAt || now - lastOpenedAt > SEVEN_DAYS_MS

    if (shouldOpenAutomatically) {
      openDialog(dialogReference)
      markGuideSeen()
    }
  }, [lastOpenedAt, pathname, openDialog, markGuideSeen])

  const content = (
    <div className="flex flex-col gap-4 text-muted-foreground">
      <p>
        <Trans>
          Lil Nouns auctions has moved beyond the traditional English auctions
          format used by Nouns, adopting a Dutch auction powered by VRGDA
          (Variable Rate Gradual Dutch Auction).
        </Trans>
      </p>
      <p>
        <Trans>
          VRGDA dynamically adjusts NFT prices based on time and demand,
          starting high and gradually dropping until minting occurs, balancing
          urgency and fairness without fixed intervals.
        </Trans>
      </p>
      <p>
        <Trans>
          Prices reduce every 15 minutes but never drop below the reserve price
          of 0.03 ETH.
        </Trans>
      </p>
      <p>
        <Trans>
          Every 12 seconds, a new quirky Lil Noun becomes available, letting you
          choose when the price feels right.
        </Trans>
      </p>
      <p>
        <Trans>
          Traits are algorithmically generated using the current token ID and a
          chosen block hash. Explore and mint from the last 256 blocks to find
          the vibe that suits you.
        </Trans>
      </p>
      <p>
        <Trans>
          Click on a Lil Noun to view its traits and current VRGDA price. Find
          the one that speaks to you.
        </Trans>
      </p>
      <p className="text-sm italic">
        <Trans>
          Join the community, mint your favorites, and embrace the delightful
          chaos of decentralized creativity.
        </Trans>
      </p>
    </div>
  )

  const TriggerButton = (
    <Button variant="outline" size="icon">
      <CircleHelpIcon />
    </Button>
  )

  return isDesktop ? (
    <Dialog open={openDialogs[dialogReference]} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans>Lil Nouns Auction Guide</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              Understand how the Lil Nouns VRGDA auctions work and discover how
              to mint your favorite NFTs.
            </Trans>
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto p-0">{content}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={openDialogs[dialogReference]} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent className="mx-4">
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Lil Nouns Auction Guide</Trans>
          </DrawerTitle>
          <DrawerDescription>
            <Trans>
              Understand how the Lil Nouns VRGDA auctions work and discover how
              to mint your favorite NFTs.
            </Trans>
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">
              <Trans>Close</Trans>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
