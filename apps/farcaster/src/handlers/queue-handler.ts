export async function queueHandler<Env, Message>(
  batch: MessageBatch<Message>,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  // A queue consumer can make requests to other endpoints on the Internet,
  // write to R2 object storage, query a D1 Database, and much more.
  for (const message of batch.messages) {
    // Process each message (we'll just log these)
    console.log(
      `message ${message.id} processed: ${JSON.stringify(message.body)}`,
    )
  }
}
