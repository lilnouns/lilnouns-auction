import { getNounSeedFromBlockHash } from '@lilnounsdao/assets'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { fetchNextNoun } from '@shared/services'

/**
 * Handles seeding of blocks in the database. It fetches the next noun,
 * retrieves a list of blocks, processes them in smaller batches to avoid
 * overwhelming SQLite, and then upserts seeds into the database.
 * @param {Env} env - An environment object containing configuration and
 *   database connection details.
 * @returns {Promise<void>} A promise that resolves when the seeding process is
 *   complete.
 */
export async function seedHandler(env: Env) {
  const adapter = new PrismaD1(env.DB)
  const prisma = new PrismaClient({ adapter })

  const { nounId } = await fetchNextNoun(env)

  const blocks = await prisma.block.findMany({
    orderBy: {
      number: 'desc',
    },
    take: 100,
  })

  // Process blocks in smaller batches to avoid overwhelming SQLite
  const batchSize = 5 // Smaller batch size for SQLite
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize)

    for (const block of batch) {
      const blockId = block.id
      const seed = getNounSeedFromBlockHash(nounId, blockId)

      try {
        const result = await prisma.seed.upsert({
          where: {
            nounId_blockId: {
              nounId,
              blockId,
            },
          },
          update: {},
          create: { ...seed, nounId, blockId },
        })
        console.log(`Upserted seed with result:`, result)
      } catch (error) {
        console.error(`Error upserting seed:`, error)
      }
    }
  }
}
