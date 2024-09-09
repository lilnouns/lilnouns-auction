import { queueHandler } from '@/handlers/queue-handler'
import { scheduledHandler } from '@/handlers/scheduled-handler'

export default {
  scheduled: async (controller, env) => {
    await scheduledHandler(controller, env)
  },
  queue: async (batch, env) => {
    await queueHandler(batch, env)
  },
} satisfies ExportedHandler<Env>
