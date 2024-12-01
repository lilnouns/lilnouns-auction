import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
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
  rewrites: async () => [
    {
      source: "/subgraphs/blocks",
      destination: process.env.BLOCKS_SUBGRAPH_URL,
    }
  ]
}

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

export default nextConfig
