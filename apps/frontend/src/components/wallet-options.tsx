import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Connector, useConnect } from 'wagmi'

export const WalletOptions = () => {
  const { connectors, connect } = useConnect()

  return (
    <>
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-6 dark:border-gray-700 dark:bg-gray-800">
        <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
          Connect wallet
        </h5>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {t`Connect with one of our available wallet providers.`}
        </p>
        <ul className="my-4 space-y-3">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() => connect({ connector })}
            />
          ))}
        </ul>
        {/*<div>
          <a
            href="#"
            className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
          >
            <svg
              className="me-2 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Why do I need to connect with my wallet?
          </a>
        </div>*/}
      </div>
    </>
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
      <a
        onClick={onClick}
        href="#"
        className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
      >
        <span className="ms-3 flex-1 whitespace-nowrap">{connector.name}</span>
      </a>
    </li>
  )
}
