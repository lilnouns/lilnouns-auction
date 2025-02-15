export interface BlockData {
  blocks?: Block[]
}

export interface Block {
  id: string
  number: number
  timestamp: number
  parentHash?: string
  author?: string
  difficulty: bigint
  totalDifficulty: bigint
  gasUsed: bigint
  gasLimit: bigint
  receiptsRoot: string
  transactionsRoot: string
  stateRoot: string
  size: bigint
  unclesHash: string
}

export interface Seed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

export interface PoolSeed {
  blockNumber: number
  seed: Seed
}
