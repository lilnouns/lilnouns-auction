import { fetchBlocks } from '@shared/services'
import { pick } from 'remeda'

/**
 * Handles the processing and upserting of Ethereum blocks.
 *
 * @param env - The environment configuration object which includes:
 *
 *   - ETHEREUM_BLOCKS_SUBGRAPH_URL: String URL for fetching Ethereum blocks.
 *   - DB: The database connection string for Prisma.
 *
 * @returns A promise that resolves when the block handling is complete.
 */
export async function blockHandler(env: Env): Promise<void> {
  const blockOffset = 0

  // Fetch only the first 100 blocks
  const blocks = await fetchBlocks(env, blockOffset)

  const blocksData = blocks.map((block) =>
    pick(block, ['id', 'number', 'timestamp']),
  )

  const chunkSize = 500 // Split into batches of 500 records
  for (let i = 0; i < blocksData.length; i += chunkSize) {
    const chunk = blocksData.slice(i, i + chunkSize)

    // Send each chunk as a separate message to the queue
    await env.QUEUE.send({ type: 'blocks', data: { blocks: chunk } })
  }
}
