// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@farcaster/frame-sdk'],
  images: {
    unoptimized: true,
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
    turbo: {
      rules: {
        '*.po': {
          loaders: ['@lingui/loader'],
          as: '*.js',
        },
      },
    },
  },
  rewrites: async () => {
    const blocksSubgraphUrl = process.env.BLOCKS_SUBGRAPH_URL

    if (!blocksSubgraphUrl) {
      throw new Error('BLOCKS_SUBGRAPH_URL is not defined.')
    }

    return [
      {
        source: '/subgraphs/blocks',
        destination: blocksSubgraphUrl,
      },
    ]
  },
}

if (process.env.NODE_ENV === 'development') {
  // await setupDevPlatform()
}

export default nextConfig
