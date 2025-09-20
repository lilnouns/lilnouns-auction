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
import { cn } from '@repo/ui/lib/utils'

const { images, bgcolors } = imageData

interface AuctionSeedDialogProps {
  poolSeed: PoolSeed
  children: React.ReactNode
}

export function AuctionSeedDialog({
  poolSeed,
  children,
}: AuctionSeedDialogProps) {
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
    isMobile ? 'mx-4 mt-5 rounded-t-lg border-none' : 'sm:max-w-2xl',
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

  const actionButtonClassName = 'w-full sm:w-auto'

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

  const traitsContent = (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)] md:gap-8">
      <div className="flex justify-center md:items-start">
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
        <Button
          onClick={() => openDialog(walletOptions)}
          className={actionButtonClassName}
        >
          <Trans>Connect Wallet</Trans>
        </Button>
      )
    }

    if (isWrongChain) {
      return (
        <Button
          onClick={() => switchChain({ chainId: correctChainId })}
          className={actionButtonClassName}
          disabled={isSwitchChainPending}
        >
          {isSwitchChainPending && <Loader2 className="animate-spin" />}
          <Trans>Switch Network</Trans>
        </Button>
      )
    }

    if (isSuccessBuyNow && txHash) {
      const shouldDisable = isConfirming || !isConfirmed
      const statusContent = (
        <>
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
        </>
      )

      if (shouldDisable) {
        return (
          <Button className={actionButtonClassName} disabled>
            {statusContent}
          </Button>
        )
      }

      return (
        <Button asChild className={actionButtonClassName}>
          <Link
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {statusContent}
          </Link>
        </Button>
      )
    }

    return (
      <Button
        onClick={() => buyNow(blockNumber, nounId)}
        disabled={isPendingBuyNow || isSuccessBuyNow}
        className={actionButtonClassName}
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

  return (
    <Root>
      <Trigger asChild>{children}</Trigger>
      <Content className={modalContentClassName}>
        <Header className={headerClassName}>
          <Title>
            <Trans>Noun Details</Trans>
          </Title>
          <Description>
            <Trans>View traits and pricing for this Noun</Trans>
          </Description>
        </Header>
        <div className={bodyClassName}>{traitsContent}</div>
        <Footer className={footerClassName}>
          {renderActionButton()}
          {isMobile && (
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                <Trans>Close</Trans>
              </Button>
            </DrawerClose>
          )}
        </Footer>
      </Content>
    </Root>
  )
}
