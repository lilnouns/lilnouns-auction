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
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@repo/ui/components/table'
import { PoolSeed } from '@/types'

import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi'

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
import { Trans } from '@lingui/react/macro'
import { Loader2 } from 'lucide-react'
import { round } from 'remeda'

const { images, bgcolors } = imageData

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

  const { switchChain, isPending: isSwitchChainPending } = useSwitchChain()

  const { openDialog } = useDialogStore()

  const {
    buyNow,
    isSuccess: isSuccessBuyNow,
    isPending: isPendingBuyNow,
    data: txHash,
  } = useBuyNow()
  const { price } = useNextNoun()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash })

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
              {formatTraitName(
                images.glasses[seed.glasses]?.filename.replace(/square-/, '') ??
                  '',
              )}
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
          <Trans>Connect Wallet</Trans>
        </Button>
      )
    }

    if (isWrongChain) {
      return (
        <Button
          onClick={() => switchChain({ chainId: correctChainId })}
          className="w-full"
          disabled={isSwitchChainPending}
        >
          {isSwitchChainPending && <Loader2 className="animate-spin" />}
          <Trans>Switch Network</Trans>
        </Button>
      )
    }

    if (isSuccessBuyNow && txHash) {
      return (
        <Link
          href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full" disabled={isConfirming || !isConfirmed}>
            {(isConfirming || !isConfirmed) && (
              <Loader2 className="animate-spin" />
            )}
            {isConfirming ? (
              <Trans>Confirming...</Trans>
            ) : isConfirmed ? (
              <Trans>View Transaction</Trans>
            ) : (
              <Trans>Pending...</Trans>
            )}
          </Button>
        </Link>
      )
    }

    return (
      <Button
        onClick={() => buyNow(blockNumber, nounId)}
        disabled={isPendingBuyNow || isSuccessBuyNow}
        className="w-full"
      >
        {isPendingBuyNow ? (
          <>
            <Loader2 className="animate-spin" />
            <Trans>Buying...</Trans>
          </>
        ) : (
          <Trans>
            Buy Now for {round(Number(formatEther(price ?? 0n)), 5)} ETH
          </Trans>
        )}
      </Button>
    )
  }

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogTitle>
            <Trans>Noun Details</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>View traits and pricing for this Noun</Trans>
          </DialogDescription>
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
          <DrawerTitle>
            <Trans>Noun Details</Trans>
          </DrawerTitle>
          <DrawerDescription>
            <Trans>View traits and pricing</Trans>
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">{content}</div>
        <DrawerFooter>
          {renderActionButton()}
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
