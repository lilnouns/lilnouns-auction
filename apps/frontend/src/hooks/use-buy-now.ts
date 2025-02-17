import { useWriteContract } from 'wagmi'
import { prop } from 'remeda'
import { mainnet, sepolia } from 'wagmi/chains'
import { useNextNoun } from '@/hooks/use-next-noun'
import { Address } from 'viem'

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
const activeChainContracts: Record<number, Address> = {
  [mainnet.id]: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
  [sepolia.id]: '0x0d8c4d18765AB8808ab6CEE4d7A760e8b93AB20c',
}

export const useBuyNow = () => {
  const { price } = useNextNoun()
  const { data, isPending, isSuccess, isError, error, writeContract } =
    useWriteContract()

  const buyNow = (blockNumber: bigint, nounId: bigint) => {
    writeContract({
      chainId: activeChainId,
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'expectedBlockNumber',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'expectedNounId',
              type: 'uint256',
            },
          ],
          name: 'buyNow',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ] as const,
      address:
        prop(activeChainContracts, activeChainId) ??
        activeChainContracts[sepolia.id],
      functionName: 'buyNow',
      args: [blockNumber, nounId],
      value: price,
    })
  }

  return { buyNow, isPending, isSuccess, data, isError, error }
}
