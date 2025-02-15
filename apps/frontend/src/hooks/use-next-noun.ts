import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { Address } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'
import { prop } from 'remeda'

interface UseNextNounResult {
  nounId: bigint | undefined
  price: bigint | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
}

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const activeChainContracts: Record<number, Address> = {
  [mainnet.id]: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
  [sepolia.id]: '0x0d8c4d18765AB8808ab6CEE4d7A760e8b93AB20c',
}

const auctionContract = {
  address:
    prop(activeChainContracts, activeChainId) ??
    activeChainContracts[sepolia.id],
  abi: [
    {
      inputs: [],
      name: 'fetchNextNoun',
      outputs: [
        {
          internalType: 'uint256',
          name: 'nounId',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'uint48',
              name: 'background',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'body',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'accessory',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'head',
              type: 'uint48',
            },
            {
              internalType: 'uint48',
              name: 'glasses',
              type: 'uint48',
            },
          ],
          internalType: 'struct INounsSeeder.Seed',
          name: 'seed',
          type: 'tuple',
        },
        {
          internalType: 'string',
          name: 'svg',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
        {
          internalType: 'bytes32',
          name: 'hash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'blockNumber',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
}

export function useNextNoun(): UseNextNounResult {
  const [nounId, setNounId] = useState<bigint | undefined>()
  const [price, setPrice] = useState<bigint | undefined>()

  const { data, isLoading, isError, error } = useReadContract({
    ...auctionContract,
    functionName: 'fetchNextNoun',
  })

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const newNounId = data[0]
      const newPrice = data[3]
      setNounId(newNounId)
      setPrice(BigInt(newPrice))
    }
  }, [data, isLoading, isError])

  return {
    nounId,
    price,
    isLoading,
    isError,
    error,
  }
}
