import { scheduledHandler } from '@/handlers/scheduled-handler'

export default {
  scheduled: async (controller, env) => {
    await scheduledHandler(controller, env)
  },
} satisfies ExportedHandler<Env>
