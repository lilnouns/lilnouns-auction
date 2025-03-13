// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import type { NextConfig } from 'next'
import { version } from '../../package.json'
import webpack from 'webpack'

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: `${version}+${process.env.CF_PAGES_COMMIT_SHA}`,
  },
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
  transpilePackages: ['@repo/ui', '@farcaster/frame-sdk'],
  webpack: (config) => {
    config.cache = false // Disables PackFileCacheStrategy

    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false,
      path: false,
    }

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '')
      }),
    )

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
