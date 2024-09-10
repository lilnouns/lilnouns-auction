import { blockHandler } from '@/handlers/block-handler'
import { seedHandler } from '@/handlers/seed-handler'
import CronTime from 'cron-time-generator'

/**
 * Handles scheduled tasks based on predefined cron schedules.
 *
 * @param controller - The controller that holds the cron schedule information.
 * @param env - The environment settings and configurations necessary for the
 *   handlers.
 * @returns - A promise indicating the completion of the scheduled task
 *   handling.
 */
export async function scheduledHandler(
  controller: ScheduledController,
  env: Env,
): Promise<void> {
  switch (controller.cron) {
    case CronTime.every(10).minutes(): {
      await seedHandler(env)
      break
    }
    case CronTime.every(30).minutes(): {
      await blockHandler(env)
      break
    }
    default: {
      console.log(`No handler for the cron schedule: ${controller.cron}`)
    }
  }
}
