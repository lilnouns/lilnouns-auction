import { blockHandler } from '@/handlers/block-handler'
import { seedHandler } from '@/handlers/seed-handler'
import CronTime from 'cron-time-generator'

/**
 * Handles scheduled tasks based on predefined cron schedules.
 * @param {ScheduledController} controller - The controller that holds the cron
 *   schedule information.
 * @param {Env} env - The environment settings and configurations necessary for
 *   the handlers.
 * @returns {Promise<void>} - A promise indicating the completion of the
 *   scheduled task handling.
 */
export async function scheduledHandler(
  controller: ScheduledController,
  env: Env,
) {
  switch (controller.cron) {
    case CronTime.everyMinute(): {
      await blockHandler(env)
      await seedHandler(env)
      break
    }
    default: {
      console.log(`No handler for the cron schedule: ${controller.cron}`)
    }
  }
}
