'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { cn } from '@repo/ui/lib/utils'

export const auctionFilter = 'auction-filter'

export function AuctionFilterDialog() {
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
    isMobile ? 'mx-4 mt-5 rounded-t-lg border-none' : 'sm:max-w-lg',
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

  const handleOpenChange = (open: boolean) =>
    open ? openDialog(auctionFilter) : closeDialog(auctionFilter)

  return (
    <Root open={openDialogs[auctionFilter]} onOpenChange={handleOpenChange}>
      <Trigger asChild>
        <Button variant="outline" size="icon">
          <FilterIcon />
        </Button>
      </Trigger>
      <Content className={modalContentClassName}>
        <Header className={headerClassName}>
          <Title>
            <Trans>Filter Auctions</Trans>
          </Title>
          <Description>
            <Trans>Select traits to filter the auction listings</Trans>
          </Description>
        </Header>
        <div className={bodyClassName}>
          <AuctionTraitFilter />
        </div>
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
