import { Trans, useLingui } from '@lingui/react/macro'
import { useDialogStore } from '@/stores/dialog-store'
import { useMedia } from 'react-use'
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
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'

export const dialogReference = 'user-guide'

export function UserGuideDialog() {
  const { t } = useLingui()
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

  const content = (
    <div className={'flex flex-col gap-4'}>
      <p className="text-muted-foreground">
        <Trans>
          Lil Nouns Auction has moved beyond the traditional English auction
          format used by Nouns. Instead, we've adopted a Dutch auction model
          powered by VRGDA (Variable Rate Gradual Dutch Auction).
        </Trans>
      </p>
      <p className="text-muted-foreground">
        <Trans>
          VRGDA dynamically adjusts NFT prices based on time and demand, aiming
          to sell tokens at a consistent pace. Prices start high and drop over
          time until someone decides it's worth minting. This creates a system
          that balances urgency and fairness without fixed intervals.
        </Trans>
      </p>
      <p className="text-muted-foreground">
        <Trans>
          Prices reduce slightly every 15 minutes to help guide minting toward
          the ideal pace. No matter the demand, the price never drops below the
          reserve price of 0.03 ETH.
        </Trans>
      </p>
      <p className="text-muted-foreground">
        <Trans>
          Every 12 seconds, a new quirky Lil Noun becomes available. Instead of
          bidding wars, you choose when the price feels right.
        </Trans>
      </p>
      <p className="text-muted-foreground">
        <Trans>
          Each Lil Noun’s traits are algorithmically generated based on the
          current token ID and a chosen block hash. The auction lets you explore
          and mint from any of the last 256 blocks. This gives you the power to
          choose the exact combination that vibes with you.
        </Trans>
      </p>
      <p className="text-muted-foreground">
        <Trans>
          Simply click on a Lil Noun image to see its full trait breakdown and
          the current VRGDA price. Find the one that speaks to you and make it
          yours.
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

  const isDesktop = useMedia('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog
        open={openDialogs[dialogReference]}
        onOpenChange={(open) =>
          open ? openDialog(dialogReference) : closeDialog(dialogReference)
        }
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <CircleHelpIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t`About Auctions`}</DialogTitle>
            <DialogDescription>{t``}</DialogDescription>
          </DialogHeader>
          <div className="  overflow-y-auto">{content}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={openDialogs[dialogReference]}
      onOpenChange={(open) =>
        open ? openDialog(dialogReference) : closeDialog(dialogReference)
      }
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleHelpIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-4">
        <DrawerHeader>
          <DrawerTitle>{t`About Auctions`}</DrawerTitle>
          <DrawerDescription>{t``}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4  overflow-y-auto">{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t`Close`}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
