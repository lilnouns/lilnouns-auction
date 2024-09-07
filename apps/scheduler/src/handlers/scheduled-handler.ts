import { blockHandler } from '@/handlers/block-handler'
import CronTime from 'cron-time-generator'

export async function scheduledHandler(
  controller: ScheduledController,
  env: Env,
) {
  switch (controller.cron) {
    case CronTime.everyMinute(): {
      await blockHandler(env)
      break
    }
    default: {
      console.log(`No handler for the cron schedule: ${controller.cron}`)
    }
  }
}
