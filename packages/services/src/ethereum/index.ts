import {
  createPublicClient,
  createWalletClient,
  extractChain,
  http,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { mainnet, sepolia } from 'viem/chains'
import { ChainId, Env } from './types'

/**
 * Returns the URL for the transport based on the environment and chain ID.
 *
 * @param env - The environment object.
 * @param env.ALCHEMY_API_KEY - The Alchemy API key.
 * @param chainId - The chain ID.
 * @returns - The transport URL.
 */
function getTransportUrl<T extends Env>(env: T, chainId: ChainId) {
  const { ALCHEMY_API_KEY: alchemyApiKey } = env

  return chainId === mainnet.id
    ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    : `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
}

/**
 * Create a client for interacting with the Ethereum mainnet.
 *
 * @param env - The environment object containing configuration parameters.
 * @param chainId - The ID of the blockchain network.
 * @returns - The created client.
 */
export function getPublicClient<T extends Env>(env: T, chainId: ChainId) {
  const transportUrl = getTransportUrl(env, chainId)

  return createPublicClient({
    chain: extractChain({ id: chainId, chains: [mainnet, sepolia] }),
    transport: http(transportUrl),
  })
}

/**
 * Retrieves a wallet client for a specific environment and chain ID.
 *
 * @param env - The environment object containing the necessary API keys and
 *   private key.
 * @param chainId - The ID of the chain for which to create the wallet client.
 * @returns The wallet client for the specified environment and chain ID.
 */
export function getWalletClient<T extends Env>(env: T, chainId: ChainId) {
  const { WALLET_MNEMONIC: mnemonic } = env

  const account = mnemonicToAccount(mnemonic)

  const transportUrl = getTransportUrl(env, chainId)

  return createWalletClient({
    account,
    chain: extractChain({ id: chainId, chains: [mainnet, sepolia] }),
    transport: http(transportUrl),
  })
}
