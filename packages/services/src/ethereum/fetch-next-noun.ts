import { getPublicClient } from './index'

/**
 * Fetches the next noun from the contract.
 * @param env - The environment object.
 * @returns - A promise that resolves to an object containing the nounId, seed,
 *   and price.
 */
export async function fetchNextNoun(env: Env) {
  const { CHAIN_ID: chainId, CONTRACT_AUCTION: auction } = env

  const client = getPublicClient(env, chainId)

  const [nounId, seed, , price] = await client.readContract({
    address: auction,
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
    ],
    functionName: 'fetchNextNoun',
    args: [],
  })

  return { nounId, seed, price }
}
