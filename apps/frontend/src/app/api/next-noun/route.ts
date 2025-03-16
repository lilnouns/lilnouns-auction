import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { prop } from 'remeda'

export const runtime = 'edge';

const activeChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || sepolia.id

const activeChainContracts: Record<number, `0x${string}`> = {
  [mainnet.id]: '0xA2587b1e2626904c8575640512b987Bd3d3B592D',
  [sepolia.id]: '0x0d8c4d18765AB8808ab6CEE4d7A760e8b93AB20c',
}

const contractAddress =
  prop(activeChainContracts, activeChainId) ?? activeChainContracts[sepolia.id]

const auctionAbi = [
  {
    inputs: [],
    name: 'fetchNextNoun',
    outputs: [
      { internalType: 'uint256', name: 'nounId', type: 'uint256' },
      {
        components: [
          { internalType: 'uint48', name: 'background', type: 'uint48' },
          { internalType: 'uint48', name: 'body', type: 'uint48' },
          { internalType: 'uint48', name: 'accessory', type: 'uint48' },
          { internalType: 'uint48', name: 'head', type: 'uint48' },
          { internalType: 'uint48', name: 'glasses', type: 'uint48' },
        ],
        internalType: 'struct INounsSeeder.Seed',
        name: 'seed',
        type: 'tuple',
      },
      { internalType: 'string', name: 'svg', type: 'string' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
      { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const client = createPublicClient({
  chain: activeChainId === mainnet.id ? mainnet : sepolia,
  transport: http(),
})

export async function GET() {
  try {
    const result = await client.readContract({
      address: contractAddress,
      abi: auctionAbi,
      functionName: 'fetchNextNoun',
    })

    return NextResponse.json(
      {
        nounId: result[0].toString(),
        price: result[3].toString(),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    )
  }
}
