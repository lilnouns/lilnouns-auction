import { useEffect, useState } from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => connect({ connector })}
    />
  ))
}

/**
 * Renders a wallet option button which is enabled if the wallet provider is
 * ready.
 *
 * @param param0 - The function parameters.
 * @param param0.connector - The wallet connector object.
 * @param param0.onClick - The function to call when the button is clicked.
 * @returns A button element that shows the connector name and triggers onClick
 *   when pressed.
 */
function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="m-1 w-full rounded bg-green-50 py-2 text-sm font-semibold text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-green-800 dark:text-gray-200 dark:hover:bg-green-700"
    >
      {connector.name}
    </button>
  )
}
