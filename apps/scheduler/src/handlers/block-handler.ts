import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { fetchBlocks } from '@shared/services'
import { pick } from 'remeda'

/**
 * Handles the processing and upserting of Ethereum blocks.
 *
 * @param {Env} env - The environment configuration object which includes:
 *
 *   - ETHEREUM_BLOCKS_SUBGRAPH_URL: String URL for fetching Ethereum blocks.
 *   - DB: The database connection string for Prisma.
 *
 * @returns {Promise<void>} A promise that resolves when the block handling is
 *   complete.
 */
export async function blockHandler(env: Env): Promise<void> {
  const blockOffset = 0

  const adapter = new PrismaD1(env.DB)
  const prisma = new PrismaClient({ adapter })

  // Fetch only the first 100 blocks
  const rawBlocks = await fetchBlocks(env, blockOffset)
  const blocks = rawBlocks.slice(0, 100)

  const processedBlocks = blocks.map((block) =>
    pick(block, ['id', 'number', 'timestamp']),
  )

  // Process blocks in smaller batches to avoid overwhelming SQLite
  const batchSize = 5 // Smaller batch size for SQLite
  for (let i = 0; i < processedBlocks.length; i += batchSize) {
    const batch = processedBlocks.slice(i, i + batchSize)

    for (const block of batch) {
      try {
        const result = await prisma.block.upsert({
          where: { id: block.id },
          update: {},
          create: block,
        })
        console.log(`Upserted block ${block.number} with result:`, result)
      } catch (error) {
        console.error(`Error upserting block ${block.number}:`, error)
      }
    }
  }
}
