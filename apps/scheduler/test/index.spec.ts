import {
  createExecutionContext,
  createScheduledController,
  env,
  waitOnExecutionContext,
} from 'cloudflare:test'
import { it } from 'vitest'
// Could import any other source file/function here
import worker from '../src'

it('calls scheduled handler', async () => {
  const ctrl = createScheduledController({
    scheduledTime: new Date(1000),
    cron: '0 * * * *',
  })
  const ctx = createExecutionContext()
  // @ts-expect-error: TypeScript doesn't recognize some aspects of the worker object
  await worker.scheduled(ctrl, env, ctx)
  await waitOnExecutionContext(ctx)
})
