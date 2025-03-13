// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'
import kvIncrementalCache from '@opennextjs/cloudflare/kv-cache'
import { OpenNextConfig } from '@opennextjs/aws/types/open-next'

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
}) as OpenNextConfig
