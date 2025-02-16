import { t } from '@lingui/core/macro'
import React, { useEffect, useState } from 'react'
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
import { WalletIcon } from 'lucide-react'
import { useDialogStore } from '@/stores/dialog-store'

export const WalletOptions = () => {
  const { openDialogs, openDialog, closeDialog } = useDialogStore()

  const { connectors, connect } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  // Close dialog when wallet gets connected
  useEffect(() => {
    if (isConnected) {
      closeDialog('wallet-connect')
    }
  }, [closeDialog, isConnected])

  return (
    <Dialog
      open={openDialogs['wallet-connect']}
      onOpenChange={(open) =>
        open ? openDialog('wallet-connect') : closeDialog('wallet-connect')
      }
    >
      <DialogTrigger>
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
      </DialogContent>
    </Dialog>
  )
}

const WalletOption = ({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <li>
      <Button
        onClick={onClick}
        variant="outline"
        className="w-full flex justify-between items-center"
      >
        {connector.name}
      </Button>
    </li>
  )
}
