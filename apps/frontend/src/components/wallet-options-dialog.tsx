'use client'

import React, { useMemo } from 'react'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@repo/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
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
import { WalletIcon } from 'lucide-react'
import { useDialogStore } from '@/stores/dialog-store'
import { useMedia, useUpdateEffect } from 'react-use'
import { Trans, useLingui } from '@lingui/react/macro'
import { defaultTo, find } from 'remeda'
import { cn } from '@repo/ui/lib/utils'

interface Eip1193Provider {
  request: (request: { method: string; params?: unknown }) => Promise<unknown>
}

export const walletOptions = 'wallet-options'

export const WalletOptionsDialog = () => {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

  const { connectors, connect, status } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

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
    isMobile ? 'mx-4 mt-5 rounded-t-lg border-none' : 'sm:max-w-md',
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

  const ethereum: Eip1193Provider | undefined = (
    globalThis as unknown as { ethereum?: Eip1193Provider }
  ).ethereum
  const hasInjected = ethereum !== undefined

  const primary = useMemo(
    () =>
      defaultTo(
        find(connectors, (c) => c.id === 'injected'),
        connectors[0],
      ),
    [connectors],
  )

  const canConnect =
    isConnected ||
    (hasInjected && (Boolean(primary) || connectors.length > 0)) ||
    status === 'pending'

  // Close dialog when wallet gets connected
  useUpdateEffect(() => {
    if (isConnected) {
      closeDialog(walletOptions)
    }
  }, [closeDialog, isConnected])

  const handleOpenChange = (open: boolean) =>
    open ? openDialog(walletOptions) : closeDialog(walletOptions)

  const content = (
    <>
      {isConnected ? (
        <div className="space-y-3">
          <div className="p-4 break-all bg-muted rounded-lg">{address}</div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => disconnect()}
          >
            <Trans>Disconnect Wallet</Trans>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() => connect({ connector })}
            />
          ))}
        </ul>
      )}
    </>
  )

  return (
    <Root open={openDialogs[walletOptions]} onOpenChange={handleOpenChange}>
      <Trigger asChild>
        <Button disabled={!canConnect} variant="outline" size="icon">
          <WalletIcon />
        </Button>
      </Trigger>
      <Content className={modalContentClassName}>
        <Header className={headerClassName}>
          <Title>
            {isConnected ? (
              <Trans>Wallet Connected</Trans>
            ) : (
              <Trans>Connect Wallet</Trans>
            )}
          </Title>
          <Description>
            {isConnected ? (
              <Trans>
                Your wallet is connected. Manage your wallet connection below.
              </Trans>
            ) : (
              <Trans>Connect with one of our available wallet providers.</Trans>
            )}
          </Description>
        </Header>
        <div className={bodyClassName}>{content}</div>
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

// WalletOption component remains unchanged
const WalletOption = ({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) => {
  const { i18n } = useLingui()
  // const [ready, setReady] = useState(false)
  //
  // useEffect(() => {
  //   ;(async () => {
  //     const provider = await connector.getProvider()
  //     setReady(!!provider)
  //   })()
  // }, [connector])

  return (
    <li>
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full flex justify-between items-center"
      >
        {i18n._(connector.name)}
      </Button>
    </li>
  )
}
