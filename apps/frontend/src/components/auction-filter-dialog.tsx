'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { Button } from '@repo/ui/components/button'
import { FilterIcon } from 'lucide-react'
import { AuctionTraitFilter } from '@/components/auction-trait-filter'
import React from 'react'
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
import { Trans } from '@lingui/react/macro'

export const auctionFilter = 'auction-filter'

export function AuctionFilterDialog() {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

  const isDesktop = useMedia('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog
        open={openDialogs[auctionFilter]}
        onOpenChange={(open) =>
          open ? openDialog(auctionFilter) : closeDialog(auctionFilter)
        }
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <FilterIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Trans>Filter Auctions</Trans>
            </DialogTitle>
            <DialogDescription>
              <Trans>Select traits to filter the auction listings</Trans>
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <AuctionTraitFilter />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={openDialogs[auctionFilter]}
      onOpenChange={(open) =>
        open ? openDialog(auctionFilter) : closeDialog(auctionFilter)
      }
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <FilterIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-4">
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Filter Auctions</Trans>
          </DrawerTitle>
          <DrawerDescription>
            <Trans>Select traits to filter the auction listings</Trans>
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <AuctionTraitFilter />
        </div>
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
