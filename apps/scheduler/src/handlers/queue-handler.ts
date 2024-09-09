import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

/**
 * Handles processing of a message batch by interfacing with a database using
 * Prisma. This method processes messages containing `blocks`, handling each
 * block in smaller batches to avoid overwhelming the SQLite database.
 *
 * @param batch - The batch of messages to process.
 * @param env - The environment configuration containing the database instance.
 * @returns A promise that resolves when the batch processing is complete.
 */
export async function queueHandler(batch: MessageBatch, env: Env) {
  try {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

    for (const message of batch.messages) {
      // @ts-expect-error: A message body type might not have a clear structure
      const { type, data } = message.body

      if (type === 'blocks') {
        const { blocks } = data

        // Process blocks in smaller batches to avoid overwhelming SQLite
        const batchSize = 5
        for (let i = 0; i < blocks.length; i += batchSize) {
          const batch = blocks.slice(i, i + batchSize)

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
    }
  } catch (error) {
    console.error('Error during batch processing:', error)
  }
}
