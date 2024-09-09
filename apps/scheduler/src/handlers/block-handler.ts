import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
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
  const blockOffset = 0

  try {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    const latestBlock = await prisma.block.findFirst({
      orderBy: {
        number: 'desc',
      },
      select: {
        number: true,
      },
    })

    const latestBlockNumber = Number(latestBlock?.number)

    if (!latestBlockNumber) {
      return
    }

    const blocks = await fetchBlocks(env, blockOffset, latestBlockNumber).catch(
      (error) => {
        console.error('Error fetching blocks:', error)
        throw new Error(
          `Error fetching blocks at offset ${blockOffset}: ${error.message}`,
        )
      },
    )

    const blocksData = blocks.map((block) =>
      pick(block, ['id', 'number', 'timestamp']),
    )

    try {
      // Send each chunk as a separate message to the queue
      await env.QUEUE.send({ type: 'blocks', data: { blocks: blocksData } })
    } catch (error) {
      console.error('Error sending blocks to queue:', error)
      throw error
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
