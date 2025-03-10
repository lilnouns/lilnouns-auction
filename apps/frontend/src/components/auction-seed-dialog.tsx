'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import { imageData } from '@repo/assets/index'
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
import Link from 'next/link'
import { useLingui } from '@lingui/react/macro'

const { images, bgcolors } = imageData

interface AuctionSeedDialogProps {
  poolSeed: PoolSeed
  children: React.ReactNode
}

export function AuctionSeedDialog({
  poolSeed,
  children,
}: AuctionSeedDialogProps) {
  const { t } = useLingui()
  const isDesktop = useMedia('(min-width: 768px)')

  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()

  const { openDialog } = useDialogStore()

  const { buyNow, isSuccess, isPending, data: hash } = useBuyNow()
  const { price } = useNextNoun()

  const correctChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  const isWrongChain = chainId !== correctChainId

  const backgrounds: { [key: string]: string } = {
    d5d7e1: 'cold',
    e1d7d5: 'warm',
  }

  const { seed, blockNumber, nounId } = poolSeed

  const content = (
    <div className="grid gap-6 -grid-cols-1 md:grid-cols-2">
      <div>
        <AuctionSeedImage seed={seed} />
      </div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Background</TableCell>
            <TableCell className="text-right">
              {formatTraitName(backgrounds[bgcolors[seed.background!]!] ?? '')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Body</TableCell>
            <TableCell className="text-right">
              {formatTraitName(images.bodies[seed.body]?.filename ?? '')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Accessory</TableCell>
            <TableCell className="text-right">
              {formatTraitName(
                images.accessories[seed.accessory]?.filename ?? '',
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Head</TableCell>
            <TableCell className="text-right">
              {formatTraitName(images.heads[seed.head]?.filename ?? '')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Glasses</TableCell>
            <TableCell className="text-right">
              {formatTraitName(images.glasses[seed.glasses]?.filename ?? '')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Noun ID</TableCell>
            <TableCell className="text-right">{nounId}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )

  const renderActionButton = () => {
    if (!isConnected) {
      return (
        <Button onClick={() => openDialog(walletOptions)} className="w-full">
          {t`Connect Wallet`}
        </Button>
      )
    }

    if (isWrongChain) {
      return (
        <Button
          onClick={() => switchChain({ chainId: correctChainId })}
          className="w-full"
        >
          {t`Switch Network`}
        </Button>
      )
    }

    if (isSuccess && hash) {
      return (
        <Link
          href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full">{t`View Transaction`}</Button>
        </Link>
      )
    }

    return (
      <Button
        onClick={() => buyNow(blockNumber, nounId)}
        disabled={isPending || isSuccess}
        className="w-full"
      >
        {isPending
          ? t`Buying...`
          : t`Buy Now for ${Number(formatEther(price ?? 0n)).toFixed(5)} ETH`}
      </Button>
    )
  }

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogTitle>{t`Noun Details`}</DialogTitle>
          <DialogDescription>{t`View traits and pricing for this Noun`}</DialogDescription>
          {content}
          <DialogFooter>{renderActionButton()}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="mx-4 max-h-[calc(100vh-20px)] mt-5">
        <DrawerHeader>
          <DrawerTitle>{t`Noun Details`}</DrawerTitle>
          <DrawerDescription>{t`View traits and pricing`}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">{content}</div>
        <DrawerFooter>
          {renderActionButton()}
          <DrawerClose asChild>
            <Button variant="outline">{t`Close`}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
