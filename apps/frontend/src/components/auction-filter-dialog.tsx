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

export const auctionFilter = 'auction-filter'

export function AuctionFilterDialog() {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

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
