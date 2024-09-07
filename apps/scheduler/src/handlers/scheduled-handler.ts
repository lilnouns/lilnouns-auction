import CronTime from 'cron-time-generator'

export async function scheduledHandler(controller: ScheduledController,env: Env) {
  switch (controller.cron) {
    case CronTime.everyHour():
    default:
      console.log(`No handler for the cron schedule: ${controller.cron}`)
  }
}
