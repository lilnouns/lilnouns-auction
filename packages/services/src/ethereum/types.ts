import { Address } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

export type ChainId = typeof mainnet.id | typeof sepolia.id

export interface Env {
  CHAIN_ID: ChainId
  CONTRACT_AUCTION: Address
  ALCHEMY_API_KEY: string
  WALLET_MNEMONIC: string
}
