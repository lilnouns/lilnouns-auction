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
import { Card, CardContent } from '@repo/ui/components/card'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@repo/ui/components/table'
import { PoolSeed } from '@/types'

import { useAccount, useSwitchChain } from 'wagmi'

import { useDialogStore } from '@/stores/dialog-store'
import { walletOptions } from '@/components/wallet-options-dialog'
import { AuctionSeedImage } from '@/components/auction-seed-image'

import { ImageData } from '@repo/utilities'
import { formatTraitName } from '@/utils/format-trait-name'
import { useBuyNow } from '@/hooks/use-buy-now'
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
import { useNextNoun } from '@/hooks/use-next-noun'
import { formatEther } from 'viem'
import React from 'react'
import { t } from '@lingui/core/macro'

const { images, bgcolors } = ImageData

interface AuctionSeedDialogProps {
  poolSeed: PoolSeed
  children: React.ReactNode
}

export function AuctionSeedDialog({
  poolSeed,
  children,
}: AuctionSeedDialogProps) {
  const isDesktop = useMedia('(min-width: 768px)')

  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()

  const { openDialog } = useDialogStore()

  const { buyNow } = useBuyNow()
  const { price } = useNextNoun()

  const correctChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  const isWrongChain = chainId !== correctChainId

  const backgrounds: { [key: string]: string } = {
    d5d7e1: 'cold',
    e1d7d5: 'warm',
  }

  const { seed, blockNumber, nounId } = poolSeed

  const content = (
    <Card className={'shadow-none border-none'}>
      <CardContent className="p-0">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <AuctionSeedImage seed={seed} />
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Background</TableCell>
                <TableCell className={'text-end'}>
                  {formatTraitName(
                    backgrounds[bgcolors[seed.background!]!] ?? '',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Body</TableCell>
                <TableCell className={'text-end'}>
                  {formatTraitName(images.bodies[seed.body]?.filename ?? '')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Accessory</TableCell>
                <TableCell className={'text-end'}>
                  {formatTraitName(
                    images.accessories[seed.accessory]?.filename ?? '',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Head</TableCell>
                <TableCell className={'text-end'}>
                  {formatTraitName(images.heads[seed.head]?.filename ?? '')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Glasses</TableCell>
                <TableCell className={'text-end'}>
                  {formatTraitName(
                    images.glasses[seed.glasses]?.filename ?? '',
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Noun ID</TableCell>
                <TableCell className={'text-end'}>{nounId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price</TableCell>
                <TableCell className={'text-end'}>
                  {price ? `${formatEther(price)} ETH` : 'N/A'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )

  const buyNowButton = (
    <Button
      onClick={() => {
        if (!isConnected) {
          openDialog(walletOptions)
        } else if (isWrongChain) {
          switchChain({ chainId: correctChainId })
        } else {
          buyNow(blockNumber, nounId)
        }
      }}
      className="w-full"
    >
      {!isConnected
        ? 'Connect Wallet'
        : isWrongChain
          ? 'Switch Chain'
          : 'Buy Now'}
    </Button>
  )

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t`Seed Details`}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter>{buyNowButton}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={'mx-4 max-h-[calc(100vh-20px)] mt-5'}>
        <DrawerHeader>
          <DrawerTitle>{t`Seed Details`}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">{content}</div>
        <DrawerFooter>
          {buyNowButton}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
