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
import { t } from '@lingui/core/macro'
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
        <DialogTrigger>
          <Button variant="outline" size="icon">
            <FilterIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t`Filter Auctions`}</DialogTitle>
            <DialogDescription>
              {t`Select traits to filter the auction listings`}
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
      <DrawerTrigger>
        <Button variant="outline" size="icon">
          <FilterIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-4">
        <DrawerHeader>
          <DrawerTitle>{t`Filter Auctions`}</DrawerTitle>
          <DrawerDescription>
            {t`Select traits to filter the auction listings`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <AuctionTraitFilter />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
