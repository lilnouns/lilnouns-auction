# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0-alpha.4] - 2025-01-18

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.1.0-alpha.3] - 2025-01-18

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.1.0-alpha.2] - 2025-01-18

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.1.0-alpha.1] - 2025-01-13

### Miscellaneous Tasks

- Update task config for `lint` and `test`

## [1.1.0-alpha.0] - 2025-01-13

### Features

- Improve loading indicator with `BarLoader`

## [1.0.0-beta.4] - 2024-12-10

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-beta.3] - 2024-12-08

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-beta.2] - 2024-12-03

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-beta.1] - 2024-12-03

### Bug Fixes

- Validate `BLOCKS_SUBGRAPH_URL` in rewrites

### Refactor

- Remove unnecessary `env.d.ts`

### Miscellaneous Tasks

- Add `BLOCKS_SUBGRAPH_URL` to environment
- Set `BLOCKS_SUBGRAPH_URL` env for build step
- Set `BLOCKS_SUBGRAPH_URL` at workflow level
- Add `BLOCKS_SUBGRAPH_URL` to build env

## [1.0.0-beta.0] - 2024-12-03

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.61] - 2024-11-30

### Bug Fixes

- Handle undefined `NEXT_PUBLIC_SITE_URL`

### Miscellaneous Tasks

- Update deployment variables for preview
- Add `type` field to `package.json`

### Styling

- Improve card header styling
- Refine image presentation and layout

## [1.0.0-alpha.60] - 2024-11-30

### Miscellaneous Tasks

- Update configs on `wrangler.toml`
- Remove placement configuration from envs
- Remove `wrangler.toml` config
- Add `wrangler.toml` for deployment config

## [1.0.0-alpha.59] - 2024-11-30

### Miscellaneous Tasks

- Remove unused configs from `wrangler.toml`

## [1.0.0-alpha.58] - 2024-11-30

### Features

- Add client-side rendering check
- Disable SSR for `Auction` component
- Add URL rewrites for subgraphs
- Enhance chain configuration
- Support dynamic contract addresses
- Extend path pattern to include `subgraphs`

### Bug Fixes

- Update environment variable name
- Update project ID environment variable
- Update `subgraphUrl` with correct path

### Miscellaneous Tasks

- Update `compatibility_date` and add env configs
- Add local env files to ignore

### Revert

- Downgrade `@cloudflare/next-on-pages`

## [1.0.0-alpha.57] - 2024-11-30

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.56] - 2024-11-30

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.55] - 2024-11-30

### Miscellaneous Tasks

- Include semver-patch in dependabot config
- Add `prestart` and `start` commands

## [1.0.0-alpha.54] - 2024-11-26

### Bug Fixes

- Update document title for noun page
- Update translation for auction title

## [1.0.0-alpha.53] - 2024-11-26

### Bug Fixes

- Update translation text to `Lil Nouns Auction`

## [1.0.0-alpha.52] - 2024-11-26

### Bug Fixes

- Update title and meta description

## [1.0.0-alpha.51] - 2024-11-26

### Features

- Add GraphQL schema for `blocks`
- Add block fetching and filtering
- Add idle state detection and pause data fetch
- Reload page on contract write success

### Refactor

- Use `globalThis.window` for client check
- Remove Prisma integration
- Simplify seed generation logic
- Remove unused variable `seedCache`
- Dynamically import `Auction` component
- Remove deprecated noun seed route
- Simplify seed parameter parsing
- Simplify `fetchData` logic
- Remove unused search and reset handlers
- Optimize `handleBuy` arguments
- Add types to `map` function parameters

### Documentation

- Switch license from Apache to GPL
- Update badges and add project status

### Miscellaneous Tasks

- Update ESLint rules
- Remove scheduler service
- Remove deploy workflow
- Remove `prebuild` script
- Remove services package and files

### Styling

- Reorder lint commands
- Add spacing for readability

## [1.0.0-alpha.50] - 2024-11-04

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.49] - 2024-11-03

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.48] - 2024-11-03

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.47] - 2024-11-03

### Miscellaneous Tasks

- Comment out Jest test execution step

## [1.0.0-alpha.46] - 2024-11-03

### Miscellaneous Tasks

- Remove unsupported Node.js versions

## [1.0.0-alpha.45] - 2024-11-03

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.44] - 2024-09-18

### Miscellaneous Tasks

- Add ESLint directive to middleware path

## [1.0.0-alpha.43] - 2024-09-18

### Features

- Update document title and meta desc

### Revert

- Update regex pattern for route exclusion

## [1.0.0-alpha.42] - 2024-09-18

### Bug Fixes

- Ensure build step always runs

### Revert

- Bump @lingui/swc-plugin in the lingui group (#230)

## [1.0.0-alpha.41] - 2024-09-18

### Features

- Add i18n support for routing
- Add i18n support for app routing
- Add support for loading `.po` files
- Add `pseudo` locale and fallback config
- Add `withLingui` HOC for language support
- Add locale detection middleware
- Add HomePage component
- Add `LinguiClientProvider` component
- Add multilingual page layout
- Update pattern to include API routes

### Bug Fixes

- Handle potential `undefined` in `traitName`
- Update regex pattern for route exclusion
- Reorder import of `linguiConfig`

### Refactor

- Update `useLinguiInit` import path
- Convert functions to arrow functions
- Add `React.FC` to component types
- Reorganize i18n utilities for clarity
- Update import paths for `lingui.config`
- Use `mapToObj` for loading catalogs
- Simplify data destructuring
- Enhance locale detection logic

### Documentation

- Enhance middleware JSDoc comments
- Refine JSDoc comments for clarity

### Miscellaneous Tasks

- Update TypeScript config settings
- Add pseudo and update translations

### Styling

- Add JSDoc tag line rule

## [1.0.0-alpha.40] - 2024-09-17

### Revert

- Bump @lingui/swc-plugin in the lingui group (#221)

## [1.0.0-alpha.39] - 2024-09-17

### Bug Fixes

- Update default `seedLimit` value to 256

## [1.0.0-alpha.38] - 2024-09-17

### Testing

- Switch test runner from jest to vitest
- Replace `jest` with `vitest` in tests

### Refactor

- Update `index.ts` to `index.tsx`

### Miscellaneous Tasks

- Migrate from Jest to Vitest

## [1.0.0-alpha.37] - 2024-09-14

### Refactor

- Comment out `limit` and `cache` settings

### Miscellaneous Tasks

- Ignore update `vitest` to latest major version

## [1.0.0-alpha.36] - 2024-09-14

### Features

- Limit blocks query to 200

### Refactor

- Streamline seed fetching logic

### Miscellaneous Tasks

- Comment out unused cron triggers

## [1.0.0-alpha.35] - 2024-09-14

### Bug Fixes

- Limit blocks fetched to 256

## [1.0.0-alpha.34] - 2024-09-10

### Refactor

- Change cron schedule to 3 hours

### Miscellaneous Tasks

- Update cron schedule to run every 3 hours

### Revert

- Remove `pages_build_output_dir`

## [1.0.0-alpha.33] - 2024-09-10

### Miscellaneous Tasks

- Add `vite-plugin-dts` to generate types
- Remove `pages_build_output_dir`

## [1.0.0-alpha.32] - 2024-09-10

### Features

- Add utilities package

### Refactor

- Update imports to use shared utilities

## [1.0.0-alpha.31] - 2024-09-10

### Features

- Update auction cache options

### Bug Fixes

- Handle `seedCache` states effectively

### Miscellaneous Tasks

- Update ignore list

## [1.0.0-alpha.30] - 2024-09-10

### Features

- Add wallet connectors to `WagmiProvider`
- Add wallet options component
- Add wallet connection check
- Add `buyNow` contract interaction
- Add additional cron trigger
- Add cron job for every 30 minutes
- Add `LILNOUNS_SUBGRAPH_URL` to `Env`

### Bug Fixes

- Acknowledge messages after processing
- Reduce `queries` array length to 1
- Adjust `blockOffset` calculation logic
- Update cron interval to 10 minutes

### Refactor

- Simplify `blockHandler` process
- Handle missing auction, code cleanup

### Miscellaneous Tasks

- Update import paths for types
- Add `delivery_delay` and `retry_delay`
- Add new cron trigger for every 10 minutes

## [1.0.0-alpha.29] - 2024-09-09

### Features

- Add queue producer to config
- Process seeds in smaller batches
- Add block pagination and pool size limit
- Add GraphQL schema for `Block` entity
- Add filtering parameters for `fetchBlocks`
- Add `fetchLastBlock` to get latest Ethereum block
- Add lilnouns GraphQL schema
- Add types for lilnouns integration
- Add `fetchLastAuction` function for lilnouns
- Add `fetchLastAuction` export

### Bug Fixes

- Add order by `block.number` to seed query
- Add retry on upsert error
- Add error handling for seeding process
- Add error handling for blocks fetching
- Serialize `bigint` before queue send
- Increase block retrieval limit to 100,000
- Update `fetchNextNoun` to `fetchLastAuction`
- Increment noun ID correctly

### Refactor

- Streamline block processing
- Rename variable for clarity
- Add error handling to `blockHandler`
- Simplify block processing loop
- Enhance block fetching error logs
- Streamline `fetchBlocks` with `request`
- Simplify `after` and `before` usage
- Simplify GraphQL response handling
- Simplify GraphQL response handling

### Miscellaneous Tasks

- Update Wrangler-generated types
- Update `CloudflareEnv` typings
- Add `prettier-plugin-toml` to plugins list
- Configure queue bindings
- Update `Env` interface to include `QUEUE`

### Performance

- Reduce `chunkSize` in block and seed handlers

## [1.0.0-alpha.28] - 2024-09-08

### Miscellaneous Tasks

- Update production database config

## [1.0.0-alpha.27] - 2024-09-08

### Features

- Add Prisma schema configuration
- Add `cache` parameter to seeds route
- Add `formatTraitName` utility function
- Add price display to auction component
- Add `DB` to `CloudflareEnv`
- Integrate Prisma with seed route
- Add `cache` state and dropdown

### Bug Fixes

- Correct seed cache type conversion

### Refactor

- Remove unused `subgraphUrl` variable

### Documentation

- Update JSDoc for `GET` function in seeds API

### Miscellaneous Tasks

- Add new database configuration
- Add `prisma generate` script to prebuild

## [1.0.0-alpha.26] - 2024-09-08

### Bug Fixes

- Use correct parameter for `fetchBlocks`
- Update `fetchBlocks` parameters

### Testing

- Add `@ts-expect-error` for `worker.scheduled`

### Refactor

- Use generic `Env` type for config
- Update `scheduledHandler` return type
- Update ESLint command and path handling

### Miscellaneous Tasks

- Add `vite.config.ts` for build setup
- Update tsconfig to strict settings
- Remove `pnpm test` from pre-commit hook
- Update ESLint configs with `jsdoc` plugin

## [1.0.0-alpha.25] - 2024-09-07

### Features

- Add scheduled handler support
- Add `Block` table and indexes
- Add `fetchBlocks` function and types
- Extend `Block` type with additional fields
- Add `blockHandler` for minute-based cron
- Add new `Seed` model and `Block` relation
- Add unique constraint to `Seed`
- Add public and wallet client creation
- Export `fetchNextNoun` function
- Add `seedHandler` to scheduled tasks

### Testing

- Add test for `scheduled` handler
- Update cron expression in test

### Refactor

- Update and restructure lint-staged config
- Use shared `fetchBlocks` utility
- Remove unused fields from `Block`
- Move `fetchBlocks` to a new file

### Documentation

- Add JSDoc comments to `blockHandler`

### Miscellaneous Tasks

- Reorganize project files for clarity
- Update ignore patterns for consistency
- Add ESLint configuration
- Add pnpm workspace configuration
- Add turbo configuration
- Rename and convert `prettier.config.js` to ESM
- Update dependencies and project name
- Update ESLint configuration
- Update start script dependencies
- Move `.npmrc` to root
- Update `wrangler.toml` config
- Add preliminary `package.json` file
- Add initial dependencies structure
- Add `test` script for vitest
- Add build and deploy scripts
- Add `.gitignore` for `node_modules` and `.env`
- Add initial Prisma schema
- Enable `driverAdapters` preview feature
- Add initial wrangler configuration
- Enable D1 database binding
- Add `prettier-plugin-prisma` to config
- Update `wrangler.toml` with `nodejs_compat`
- Add `vitest.config` for worker tests
- Add `dist` to `.gitignore`
- Add TypeScript definitions for Env
- Add `tsconfig.json` for TypeScript setup
- Update ESLint configuration
- Add `.eslintrc.json` config
- Add tsconfig.json for TypeScript setup
- Add ESLint configuration
- Update ESLint config with TypeScript support
- Add `start` script for local dev
- Update worker configuration types
- Update `fetchBlocks` import for better modularity
- Add GitHub Actions workflow for deployment
- Update ESLint configuration
- Update env variables for config
- Update `tsconfig` includes
- Add `ALCHEMY_API_KEY` to deployment secrets

## [1.0.0-alpha.24] - 2024-09-05

### Bug Fixes

- Solve some minor issues and update dependencies

## [1.0.0-alpha.23] - 2024-09-03

### Features

- Add search button and simplify dependencies
- Add reset button to clear filters

### Bug Fixes

- Update project name in locales

### Refactor

- Rename state variables for clarity

## [1.0.0-alpha.22] - 2024-09-03

### Features

- Disable limit input when multiple filters selected
- Add skeleton loading cards

### Refactor

- Extract auction component
- Abstract auction contract object

### Styling

- Improve layout and responsiveness
- Wrap main content in responsive container

## [1.0.0-alpha.21] - 2024-09-03

### Features

- Improve seed card layout and add button

### Bug Fixes

- Reduce initial `limit` state to 8

### Styling

- Add vertical padding to main container

## [1.0.0-alpha.20] - 2024-09-03

### Features

- Enhance trait name formatting

## [1.0.0-alpha.19] - 2024-09-03

### Refactor

- Fetch blocks concurrently
- Increase `blockOffset` batch size

### Documentation

- Update dev server command to `pnpm`

### Styling

- Shorten page padding and update text

## [1.0.0-alpha.18] - 2024-09-02

### Features

- Add dynamic RPC URLs for wagmi chains

### Bug Fixes

- Improve error and loading states
- Handle auction error in `useReadContract`

### Styling

- Enhance form inputs with consistent styling

## [1.0.0-alpha.17] - 2024-09-02

### Features

- Add support for customizable limit
- Add `nounId` state and `refetch` logic

### Refactor

- Remove unused `nounId` dependency

## [1.0.0-alpha.16] - 2024-09-01

### Features

- Integrate Wagmi and React Query providers
- Integrate `useReadContract` for noun data

### Bug Fixes

- Add `limit` parameter to query params

### Refactor

- Move `WagmiProvider` and `QueryClientProvider`

### Miscellaneous Tasks

- Update workflow for develop and Node.js v22

## [1.0.0-alpha.15] - 2024-09-01

### Miscellaneous Tasks

- Remove obsolete workflow template

## [1.0.0-alpha.14] - 2024-09-01

### Miscellaneous Tasks

- Update configurations for deployment
- Update compatibility flags

## [1.0.0-alpha.13] - 2024-08-31

### Features

- Enable dark mode and update content paths
- Add locale utilities for i18n support
- Add Vazirmatn font and global styles
- Add localization hooks
- Add `Layout`, `ThemeSwitcher`, and `LocaleSwitcher` components
- Add `_app.tsx` for global setup
- Add custom `_document` for locale support
- Add locale-based redirection on home page
- Add multi-lingual support with Lingui
- Add `GET` method to seeds route
- Add seeds endpoint for noun processing
- Fetch and display noun seed data
- Filter `Seed` results based on query params
- Dynamically fetch noun data by ID
- Add cache control to seeds endpoint response
- Add customizable seed query filters

### Bug Fixes

- Add missing dependency in useEffect
- Remove redundant interval in `useEffect`

### Testing

- Add unit tests for `Home`

### Refactor

- Migrate `tailwind.config.js` to `.ts`
- Convert config to ES module
- Extract block fetching logic
- Improve block fetching logic
- Simplify block fetching logic
- Improve SVG rendering and error handling
- Optimize SVG rendering with `useCallback`
- Enhance data fetching logic
- Remove unused `seeds` route
- Update messages for Next.js & Lingui site
- Simplify seed data update logic
- Populate selects dynamically from `ImageData`

### Miscellaneous Tasks

- Update pre-commit hook for language files
- Remove redundant Next.js pages
- Add cssnano for production builds
- Add `lingui` for localization
- Add initial Jest config
- Optimize images and enable standalone output
- Update TypeScript config for bundler
- Rename and export `next.config.mjs`
- Update ignored files for sitemap
- Update `types` field
- Add `setupDevPlatform` for dev environment
- Add `wrangler.toml` for configuration
- Add `CloudflareEnv` interface
- Add `eslint-plugin-next-on-pages` to eslint
- Update Next.js configuration
- Update `NODE_VERSION` to 22.3.0
- Update for cloudflare setup

### Styling

- Refine layout and theme styles
- Disable eslint for SVG `img` tag

## [1.0.0-alpha.12] - 2024-08-29

### Miscellaneous Tasks

- Add `.editorconfig` for consistent coding styles
- Update linting config and plugins
- Add `.eslintignore` file to exclude configs
- Update `start` script with compatibility flag
- Remove unused `preexport` and `export` scripts
- Add lint-staged config for pre-commit hooks
- Add pre-commit hook to run linters and tests

## [1.0.0-alpha.11] - 2024-08-29

### Miscellaneous Tasks

- Fix indentation in YAML config
- Add initial commit check and build enhancements
- Add workflow for automated PR creation
- Add initial template cleanup workflow
- Add GitHub issue templates
- Update config and enhance parsing rules

## [1.0.0-alpha.10] - 2023-07-04

### Documentation

- Add funding to the packge configs
- Set sponsorships configuration for github

### Miscellaneous Tasks

- Switch `package-ecosystem` from `npm` to `pnpm` for Dependabot
- Change `package-ecosystem` back to `npm` on Dependabot configs
- Update matrix `node-version` on build workflow

## [1.0.0-alpha.8] - 2023-05-18

### Miscellaneous Tasks

- Change `open-pull-requests-limit` from 10 to 20
- Add node version 20 on `build` workflow

## [1.0.0-alpha.7] - 2023-04-24

### Miscellaneous Tasks

- Bump `pnpm` version from 7 to 8 on `pnpm` workflow

## [1.0.0-alpha.6] - 2023-04-01

### Documentation

- Change the project license to`APLv2`

## [1.0.0-alpha.5] - 2023-01-02

### Miscellaneous Tasks

- Setup stale bot to closes abandoned issues
- Add a new `release` workflow to create releases

## [1.0.0-alpha.4] - 2022-11-04

### Miscellaneous Tasks

- Enable `auto-install-peers` and disable `strict-peer-dependencies`
- Add a new `pnpm` workflow to update lock file
- Update and improve the `build` workflow

## [1.0.0-alpha.3] - 2022-09-21

### Miscellaneous Tasks

- Add `wrangler` for develop and serve functions

## [1.0.0-alpha.2] - 2022-09-12

### Refactor

- Add basic sitemap configuration
- Add default seo config and information

### Miscellaneous Tasks

- Enable pre and post scripts running by `pnpm`
- Solve warning regard to experimental images optimization
- Replace `yarn` by `pnpm` over `build` workflow

## [1.0.0-alpha.0] - 2022-08-29

### Refactor

- Cleanup home page and styles
- Add `londrina-solid` font from google as default

### Documentation

- Cleanup the project main readme file

### Miscellaneous Tasks

- Create new next project using creator
- Add a configuration file for `dependabot`
- Add new `build` github worklfow to run on pushs
- Add `export` to the package scripts
- Configure `unoptimized` in next configs
- Remove api folder due to static generation
- Add `git-clif` configuration file
- Replace default favicon by a nouns favicon
- Install and initialize tailwind css

<!-- generated by git-cliff -->
