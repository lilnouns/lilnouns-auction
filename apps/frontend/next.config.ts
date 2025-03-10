// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@farcaster/frame-sdk'],
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    swcPlugins: [
      [
        '@lingui/swc-plugin',
        {
          // the same options as in .swcrc
        },
      ],
    ],
  },
  webpack: (config) => {
    config.cache = false // Disables PackFileCacheStrategy

    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false,
    }

    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: '@lingui/loader',
      },
    })

    // Important: return the modified config
    return config
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
