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
  blockNumber: bigint
  nounId: bigint
  seed: Seed
}

export type FrameEmbed = {
  // Frame spec version. Required.
  // Example: "next"
  version: 'next'

  // Frame image.
  // Max 512 characters.
  // Image must be 3:2 aspect ratio and less than 10 MB.
  // Example: "https://yoink.party/img/start.png"
  imageUrl: string

  // Button attributes
  button: {
    // Button text.
    // Max length of 32 characters.
    // Example: "Yoink Flag"
    title: string

    // Action attributes
    action: {
      // Action type. Must be "launch_frame".
      type: 'launch_frame'

      // App name
      // Max length of 32 characters.
      // Example: "Yoink!"
      name: string

      // Frame launch URL.
      // Max 512 characters.
      // Example: "https://yoink.party/"
      url: string

      // Splash image URL.
      // Max 512 characters.
      // Image must be 200x200px and less than 1MB.
      // Example: "https://yoink.party/img/splash.png"
      splashImageUrl: string

      // Hex color code.
      // Example: "#eeeee4"
      splashBackgroundColor: string
    }
  }
}
