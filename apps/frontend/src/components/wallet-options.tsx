import { MenuItem } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Connector, useConnect } from 'wagmi'

export const WalletOptions = () => {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => connect({ connector })}
    />
  ))
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
    <MenuItem>
      <a
        onClick={onClick}
        href="#"
        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
      >
        {connector.name}
      </a>
    </MenuItem>
  )
}
