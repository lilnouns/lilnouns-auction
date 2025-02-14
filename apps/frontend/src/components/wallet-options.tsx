import { t } from '@lingui/core/macro'
import { useEffect, useState } from 'react'
import { Connector, useConnect } from 'wagmi'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@repo/ui/components/card'
import { Button } from '@repo/ui/components/button'

export const WalletOptions = () => {
  const { connectors, connect } = useConnect()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>{t`Connect with one of our available wallet providers.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() => connect({ connector })}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
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
