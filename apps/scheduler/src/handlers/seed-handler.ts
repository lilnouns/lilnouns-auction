import { getNounSeedFromBlockHash } from '@lilnounsdao/assets'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { fetchNextNoun } from '@shared/services'

/**
 * Handles seeding of blocks in the database. It fetches the next noun,
 * retrieves a list of blocks, processes them in smaller batches to avoid
 * overwhelming SQLite, and then upserts seeds into the database.
 *
 * @param env - An environment object containing configuration and database
 *   connection details.
 * @returns A promise that resolves when the seeding process is complete.
 */
export async function seedHandler(env: Env): Promise<void> {
  try {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    const { nounId } = await fetchNextNoun(env).catch((error) => {
      console.error('Error fetching next noun:', error)
      throw error
    })

    const blocks = await prisma.block
      .findMany({
        orderBy: {
          number: 'desc',
        },
        take: 100,
      })
      .catch((error) => {
        console.error('Error retrieving blocks from database:', error)
        throw error
      })

    const chunkSize = 50
    for (let i = 0; i < blocks.length; i += chunkSize) {
      const chunk = blocks.slice(i, i + chunkSize)
      const seeds = []
      for (const block of chunk) {
        try {
          const blockId = block.id
          const seed = getNounSeedFromBlockHash(nounId, blockId)
          seeds.push({ ...seed, nounId, blockId })
        } catch (error) {
          console.error(
            `Error generating seed for block ID ${block.id}:`,
            error,
          )
          continue // Skip this block and continue with the next one
        }
      }

      try {
        // Send each chunk as a separate message to the queue
        await env.QUEUE.send({ type: 'seeds', data: { seeds: chunk } })
      } catch (error) {
        console.error('Error sending seeds to queue:', error)
        throw error
      }
    }
  } catch (error) {
    console.error('Seeding process failed:', error)
    throw error
  }
}
