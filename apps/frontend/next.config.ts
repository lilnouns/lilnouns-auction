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
  headers: () =>
    Promise.resolve([
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-build-id',
            value: process.env.CF_PAGES_COMMIT_SHA ?? 'dev',
          },
        ],
      },
    ]),
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Remove console.* calls in production client-side bundles
      // Safer approach that checks if minimizer exists
      if (config.optimization?.minimizer?.length > 0) {
        const terserPlugin = config.optimization.minimizer.find(
          (plugin: any) => plugin.constructor.name === 'TerserPlugin',
        )
        if (terserPlugin && terserPlugin.options) {
          terserPlugin.options.terserOptions = {
            ...terserPlugin.options.terserOptions,
            compress: {
              ...terserPlugin.options.terserOptions?.compress,
              drop_console: true,
            },
          }
        }
      }
    }

    config.cache = false // Disables PackFileCacheStrategy

    config.experiments = { ...config.experiments, topLevelAwait: true }

    config.externals['node:fs'] = 'commonjs node:fs'

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
}

if (process.env.NODE_ENV === 'development') {
  // await setupDevPlatform()
}

export default nextConfig
