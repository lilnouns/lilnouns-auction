# Changelog

All notable changes to this project will be documented in this file.

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
