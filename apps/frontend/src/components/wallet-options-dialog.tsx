'use client'

import React, { useEffect } from 'react'
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
import { useMedia } from 'react-use'
import { useLingui } from '@lingui/react/macro'

export const walletOptions = 'wallet-options'

export const WalletOptionsDialog = () => {
  const { t, i18n } = useLingui()
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

  const { connectors, connect } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  const isDesktop = useMedia('(min-width: 768px)')

  // Close dialog when wallet gets connected
  useEffect(() => {
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
            {t`Disconnect Wallet`}
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
          <Button variant="outline" size="icon">
            <WalletIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isConnected ? t`Wallet Connected` : t`Connect Wallet`}
            </DialogTitle>
            <DialogDescription>
              {isConnected
                ? t`Your wallet is connected. Manage your wallet connection below.`
                : t`Connect with one of our available wallet providers.`}
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
      <DrawerTrigger>
        <Button variant="outline" size="icon">
          <WalletIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-4">
        <DrawerHeader>
          <DrawerTitle>
            {isConnected ? t`Wallet Connected` : t`Connect Wallet`}
          </DrawerTitle>
          <DrawerDescription>
            {isConnected
              ? t`Your wallet is connected. Manage your wallet connection below.`
              : t`Connect with one of our available wallet providers.`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">{content}</div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
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
  const { t, i18n } = useLingui()
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
