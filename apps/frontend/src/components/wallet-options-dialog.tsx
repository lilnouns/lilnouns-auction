'use client'

import React, { useMemo } from 'react'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@repo/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface Eip1193Provider {
  request: (request: { method: string; params?: unknown }) => Promise<unknown>
}

export const walletOptions = 'wallet-options'

export const WalletOptionsDialog = () => {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

  const { connectors, connect, status } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  const isDesktop = useMedia('(min-width: 768px)')

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

  if (isDesktop) {
    return (
      <Dialog
        open={openDialogs[walletOptions]}
        onOpenChange={(open) =>
          open ? openDialog(walletOptions) : closeDialog(walletOptions)
        }
      >
        <DialogTrigger asChild>
          <Button disabled={!canConnect} variant="outline" size="icon">
            <WalletIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isConnected ? (
                <Trans>Wallet Connected</Trans>
              ) : (
                <Trans>Connect Wallet</Trans>
              )}
            </DialogTitle>
            <DialogDescription>
              {isConnected ? (
                <Trans>
                  Your wallet is connected. Manage your wallet connection below.
                </Trans>
              ) : (
                <Trans>
                  Connect with one of our available wallet providers.
                </Trans>
              )}
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={openDialogs[walletOptions]}
      onOpenChange={(open) =>
        open ? openDialog(walletOptions) : closeDialog(walletOptions)
      }
    >
      <DrawerTrigger asChild>
        <Button disabled={!canConnect} variant="outline" size="icon">
          <WalletIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-4">
        <DrawerHeader>
          <DrawerTitle>
            {isConnected ? (
              <Trans>Wallet Connected</Trans>
            ) : (
              <Trans>Connect Wallet</Trans>
            )}
          </DrawerTitle>
          <DrawerDescription>
            {isConnected ? (
              <Trans>
                Your wallet is connected. Manage your wallet connection below.
              </Trans>
            ) : (
              <Trans>Connect with one of our available wallet providers.</Trans>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">{content}</div>
        <DrawerFooter>
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
