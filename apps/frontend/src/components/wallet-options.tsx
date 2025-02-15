import { t } from '@lingui/core/macro'
import React, { useEffect, useState } from 'react'
import { Connector, useConnect } from 'wagmi'
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

export const WalletOptions = () => {
  const { connectors, connect } = useConnect()

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <WalletIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t`Connect Wallet`}</DialogTitle>
          <DialogDescription>
            {t`Connect with one of our available wallet providers.`}
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-3">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() => connect({ connector })}
            />
          ))}
        </ul>
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
