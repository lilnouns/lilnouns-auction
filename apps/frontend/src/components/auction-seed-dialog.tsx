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
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Trans } from '@lingui/react/macro'
import { ChevronDown, Loader2 } from 'lucide-react'
import { round } from 'remeda'
import { cn } from '@repo/ui/lib/utils'
import { Badge } from '@repo/ui/components/badge'

const { images, bgcolors } = imageData
const countFormatter = new Intl.NumberFormat()

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
    'flex h-full max-h-[calc(100dvh-2rem)] flex-col overflow-hidden bg-background p-0 shadow-lg',
    isMobile
      ? 'mx-4 mt-5 rounded-t-[1.25rem] border-none'
      : 'sm:max-w-3xl sm:rounded-lg',
  )
  const headerClassName = cn(
    'sticky top-0 z-30 border-b border-border/50 bg-background/95 px-4 pb-4 pt-5 text-left backdrop-blur supports-[backdrop-filter]:bg-background/75',
    !isMobile && 'px-6 pb-4 pt-6',
  )
  const bodyClassName = cn(
    'flex-1 overflow-y-auto px-4 py-5',
    !isMobile && 'px-6 py-6',
  )
  const footerClassName = cn(
    'sticky bottom-0 z-30 flex flex-col gap-3 border-t border-border/50 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-end',
    !isMobile && 'px-6',
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

  const traitRows = useMemo(
    () => {
      const backgroundKey =
        seed.background !== undefined ? bgcolors[seed.background] : undefined
      const backgroundLabel = formatTraitName(
        backgroundKey ? backgrounds[backgroundKey] ?? '' : '',
      )

      const bodyLabel = formatTraitName(
        seed.body !== undefined ? images.bodies[seed.body]?.filename ?? '' : '',
      )
      const accessoryLabel = formatTraitName(
        seed.accessory !== undefined
          ? images.accessories[seed.accessory]?.filename ?? ''
          : '',
      )
      const headLabel = formatTraitName(
        seed.head !== undefined ? images.heads[seed.head]?.filename ?? '' : '',
      )
      const glassesSource =
        seed.glasses !== undefined
          ? images.glasses[seed.glasses]?.filename ?? ''
          : ''
      const glassesLabel = formatTraitName(
        glassesSource ? glassesSource.replace(/square-/, '') : '',
      )

      return [
        { label: 'Background', value: backgroundLabel || '—' },
        { label: 'Body', value: bodyLabel || '—' },
        { label: 'Accessory', value: accessoryLabel || '—' },
        { label: 'Head', value: headLabel || '—' },
        { label: 'Glasses', value: glassesLabel || '—' },
      ]
    },
    [seed],
  )

  const priceLabel = useMemo(() => {
    if (price === undefined) return '—'
    const formatted = Number.parseFloat(formatEther(price))
    return `${round(formatted, 5)} ETH`
  }, [price])
  const hasPrice = price !== undefined

  const blockLabel = useMemo(() => {
    if (blockNumber === undefined) return '—'
    try {
      return countFormatter.format(Number(blockNumber))
    } catch (error) {
      return blockNumber.toString()
    }
  }, [blockNumber])

  const nounIdLabel = useMemo(() => {
    if (nounId === undefined) return null
    try {
      return `#${countFormatter.format(Number(nounId))}`
    } catch (error) {
      return `#${nounId.toString()}`
    }
  }, [nounId])

  const nounIdDisplay = nounIdLabel ? nounIdLabel.replace('#', '') : '—'

  const tableRows = useMemo(
    () => [...traitRows, { label: 'Noun ID', value: nounIdDisplay }],
    [traitRows, nounIdDisplay],
  )

  const traitBadges = useMemo(
    () => traitRows.filter((row) => row.value !== '—'),
    [traitRows],
  )

  const traitTableContent = (
    <Table>
      <TableBody>
        {tableRows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className="font-medium text-sm text-muted-foreground">
              {row.label}
            </TableCell>
            <TableCell className="text-right text-sm font-semibold">
              {row.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const [traitsExpanded, setTraitsExpanded] = useState(!isMobile)

  useEffect(() => {
    setTraitsExpanded(!isMobile)
  }, [isMobile])

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
        ) : hasPrice ? (
          <Trans>Buy Now for {priceLabel}</Trans>
        ) : (
          <Trans>Buy Now</Trans>
        )}
      </Button>
    )
  }

  return (
    <Root>
      <Trigger asChild>{children}</Trigger>
      <Content className={modalContentClassName}>
        <Header className={headerClassName}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Title className="flex items-center gap-2">
                <Trans>Noun Details</Trans>
                {nounIdLabel && (
                  <Badge variant="secondary" className="text-xs">
                    {nounIdLabel}
                  </Badge>
                )}
              </Title>
            </div>
            <Description>
              <Trans>View traits and pricing for this Noun</Trans>
            </Description>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Trans>Current Price</Trans>
                </p>
                <p className="text-2xl font-semibold">{priceLabel}</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Trans>Block Number</Trans>
                </p>
                <p className="text-lg font-semibold">{blockLabel}</p>
              </div>
            </div>
            {traitBadges.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {traitBadges.map((trait) => (
                  <Badge
                    key={trait.label}
                    variant="outline"
                    className="text-xs font-medium"
                  >
                    {trait.label}: {trait.value}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Header>
        <div className={bodyClassName}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-10">
              <div className="w-full max-w-[min(360px,80vw)] md:max-w-sm">
                <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
                  <AuctionSeedImage seed={seed} />
                </div>
              </div>
              <div className="hidden w-full md:block">
                <div className="rounded-xl border border-border/50 bg-muted/10 p-1">
                  {traitTableContent}
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTraitsExpanded((prev) => !prev)}
                aria-expanded={traitsExpanded}
                className="flex w-full items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm font-medium"
              >
                <span>
                  {traitsExpanded ? (
                    <Trans>Hide Traits</Trans>
                  ) : (
                    <Trans>Show Traits</Trans>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    traitsExpanded ? 'rotate-180' : 'rotate-0',
                  )}
                />
              </Button>
              {traitsExpanded && (
                <div className="mt-3 rounded-xl border border-border/50 bg-muted/10 p-1">
                  {traitTableContent}
                </div>
              )}
            </div>
          </div>
        </div>
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
