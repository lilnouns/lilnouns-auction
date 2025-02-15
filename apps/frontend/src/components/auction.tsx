'use client'

import { AuctionTraitFilter } from '@/components/auction-trait-filter'
import { AuctionPreviewGrid } from '@/components/auction-preview-grid'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui//components/drawer'
import { Button } from '@repo/ui/components/button'

export default function Auction() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-1">
        <section className="w-full max-w-screen-xl p-1">
          <div className="container mx-auto">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full">
                  <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <AuctionTraitFilter />
                  </div>
                  <DrawerFooter>
                    <DrawerClose>
                      <Button className={'w-full'} variant="outline">
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            <AuctionPreviewGrid />
          </div>
        </section>
      </div>
    </>
  )
}
