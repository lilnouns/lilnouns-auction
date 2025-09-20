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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { cn } from '@repo/ui/lib/utils'

export const dialogReference = 'user-guide'
const STORAGE_KEY = 'user-guide-last-opened-at'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function UserGuideDialog() {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()
  const isMobile = useMedia('(max-width: 767px)', false)
  const Root = isMobile ? Drawer : Dialog
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger
  const Content = isMobile ? DrawerContent : DialogContent
  const Header = isMobile ? DrawerHeader : DialogHeader
  const Title = isMobile ? DrawerTitle : DialogTitle
  const Description = isMobile ? DrawerDescription : DialogDescription
  const Footer = isMobile ? DrawerFooter : DialogFooter
  const modalContentClassName = cn(
    'flex max-h-[85vh] flex-col overflow-hidden gap-0 p-0',
    isMobile ? 'mx-4 mt-5 rounded-t-lg border-none' : 'sm:max-w-xl',
  )
  const headerClassName = cn(
    'text-left',
    isMobile ? 'px-4 pt-6 pb-4' : 'px-6 pt-6 pb-2',
  )
  const bodyClassName = cn(
    'flex-1 overflow-y-auto',
    isMobile ? 'px-4 pb-4' : 'px-6 pb-6',
  )
  const footerClassName = cn(
    'gap-3 border-t border-border/40',
    isMobile ? 'px-4 pb-4 pt-1' : 'px-6 pb-6 pt-3',
  )
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

  return (
    <Root open={openDialogs[dialogReference]} onOpenChange={handleOpenChange}>
      <Trigger asChild>{TriggerButton}</Trigger>
      <Content className={modalContentClassName}>
        <Header className={headerClassName}>
          <Title>
            <Trans>Lil Nouns Auction Guide</Trans>
          </Title>
          <Description>
            <Trans>
              Understand how the Lil Nouns VRGDA auctions work and discover how
              to mint your favorite NFTs.
            </Trans>
          </Description>
        </Header>
        <div className={bodyClassName}>{content}</div>
        {isMobile && (
          <Footer className={footerClassName}>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                <Trans>Close</Trans>
              </Button>
            </DrawerClose>
          </Footer>
        )}
      </Content>
    </Root>
  )
}
