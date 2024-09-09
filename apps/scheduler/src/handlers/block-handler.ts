import { fetchBlocks } from '@shared/services'
import { pick } from 'remeda'

/**
 * Handles the Ethereum blocks by fetching them, processing, and sending them in
 * batches to a queue.
 *
 * @param env - The environment configuration object.
 * @returns A promise representing the completion of the block handling process.
 */
export async function blockHandler(env: Env): Promise<void> {
  const poolSize = 100_000
  let blockOffset = 0
  let totalFetchedBlocks = 0
  let moreBlocksAvailable = true

  try {
    while (moreBlocksAvailable) {
      const blocks = await fetchBlocks(env, blockOffset).catch((error) => {
        console.error('Error fetching blocks:', error)
        throw new Error(
          `Error fetching blocks at offset ${blockOffset}: ${error.message}`,
        )
      })

      totalFetchedBlocks += blocks.length

      if (blocks.length === 0 || totalFetchedBlocks >= poolSize) {
        moreBlocksAvailable = false
        break
      }

      const chunkSize = 50
      const blocksData = blocks.map((block) =>
        pick(block, ['id', 'number', 'timestamp']),
      )

      for (let i = 0; i < blocksData.length; i += chunkSize) {
        const chunk = blocksData.slice(i, i + chunkSize)

        try {
          // Send each chunk as a separate message to the queue
          await env.QUEUE.send({ type: 'blocks', data: { blocks: chunk } })
        } catch (error) {
          console.error('Error sending blocks to queue:', error)
          throw error
        }
      }

      blockOffset += blocks.length
    }
  } catch (error) {
    console.error(
      'Detailed error processing Ethereum blocks at offset:',
      blockOffset,
      'Error:',
      error,
    )
  }
}
