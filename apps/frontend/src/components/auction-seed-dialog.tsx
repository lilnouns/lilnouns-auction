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
import React, { useMemo } from 'react'
import Link from 'next/link'
import { Trans } from '@lingui/react/macro'
import { Loader2 } from 'lucide-react'
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
    } catch {
      return blockNumber.toString()
    }
  }, [blockNumber])

  const nounIdLabel = useMemo(() => {
    if (nounId === undefined) return null
    try {
      return `#${countFormatter.format(Number(nounId))}`
    } catch {
      return `#${nounId.toString()}`
    }
  }, [nounId])

  const nounIdDisplay = nounIdLabel ? nounIdLabel.replace('#', '') : '—'

  const traitCards = useMemo(() => {
    const backgroundKey =
      seed.background !== undefined ? bgcolors[seed.background] : undefined
    const backgroundLabel = formatTraitName(
      backgroundKey ? (backgrounds[backgroundKey] ?? '') : '',
    )

    const bodyLabel = formatTraitName(
      seed.body !== undefined ? (images.bodies[seed.body]?.filename ?? '') : '',
    )
    const accessoryLabel = formatTraitName(
      seed.accessory !== undefined
        ? (images.accessories[seed.accessory]?.filename ?? '')
        : '',
    )
    const headLabel = formatTraitName(
      seed.head !== undefined ? (images.heads[seed.head]?.filename ?? '') : '',
    )
    const glassesSource =
      seed.glasses !== undefined
        ? (images.glasses[seed.glasses]?.filename ?? '')
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
      { label: 'Noun ID', value: nounIdDisplay },
    ]
  }, [
    seed.background,
    seed.body,
    seed.accessory,
    seed.head,
    seed.glasses,
    backgrounds,
    nounIdDisplay,
  ])

  const traitBadges = useMemo(
    () => traitCards.filter((row) => row.value !== '—').slice(0, 3),
    [traitCards],
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
            {!isMobile && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <StatCard
                  label={<Trans>Current Price</Trans>}
                  value={priceLabel}
                  emphasis
                  className="sm:col-span-2"
                />
                <StatCard label={<Trans>Block</Trans>} value={blockLabel} />
              </div>
            )}
            {!isMobile && traitBadges.length > 0 && (
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
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
            <div className="space-y-4">
              <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-sm">
                <AuctionSeedImage seed={seed} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:hidden">
                <StatCard label={<Trans>Block</Trans>} value={blockLabel} />
                <StatCard label={<Trans>Noun</Trans>} value={nounIdDisplay} />
              </div>
            </div>
            <div className="space-y-4">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    <Trans>Traits</Trans>
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {traitCards.length}
                    <span className="sr-only">
                      <Trans>total traits</Trans>
                    </span>
                  </Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {traitCards.map((trait) => (
                    <TraitCard
                      key={trait.label}
                      label={trait.label}
                      value={trait.value}
                    />
                  ))}
                </div>
              </section>
              <section className="hidden sm:block">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <StatCard label={<Trans>Block</Trans>} value={blockLabel} />
                  <StatCard label={<Trans>Noun</Trans>} value={nounIdDisplay} />
                </div>
              </section>
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

function StatCard({
  label,
  value,
  emphasis = false,
  className,
}: {
  label: React.ReactNode
  value: React.ReactNode
  emphasis?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-muted/15 px-3 py-3 shadow-sm ring-1 ring-border/20',
        emphasis ? 'sm:py-5' : 'sm:py-4',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'font-semibold text-foreground',
          emphasis ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl',
        )}
      >
        {value}
      </p>
    </div>
  )
}

function TraitCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/15 px-3 py-2 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}
