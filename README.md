# Lil Nouns Auction

[![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/lilnouns/lilnouns-auction?include_prereleases)](https://github.com/lilnouns/lilnouns-auction/releases)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/lilnouns/lilnouns-auction/build.yml)](https://github.com/lilnouns/lilnouns-auction/actions/workflows/build.yml)
[![GitHub](https://img.shields.io/github/license/lilnouns/lilnouns-auction)](https://github.com/lilnouns/lilnouns-auction/blob/master/LICENSE)
[![X (formerly Twitter) Follow](https://img.shields.io/badge/follow-%40nekofar-ffffff?logo=x&style=flat)](https://x.com/nekofar)
[![Farcaster (Warpcast) Follow](https://img.shields.io/badge/follow-%40nekofar-855DCD.svg?logo=farcaster&logoColor=f5f5f5&style=flat)](https://warpcast.com/nekofar)
[![Donate](https://img.shields.io/badge/donate-nekofar.crypto-a2b9bc?logo=ethereum&logoColor=f5f5f5)](https://ud.me/nekofar.crypto)

## Description

This repository is a pnpm + Turbo monorepo for Lil Nouns Auction that provides:

- A Next.js frontend (`apps/frontend`) for exploring Lil Nouns VRGDA auctions and related data.
- A Farcaster worker (`apps/farcaster`) for auction-related casts/automation and integrations.
- Shared UI, assets, and configuration packages under `packages/*`.

This repo keeps feature code scoped to each app to avoid accidental coupling, with shared primitives exposed via the `@repo/*` namespace.

## Monorepo Layout

- `apps/frontend` – Next.js UI
- `apps/farcaster` – Farcaster worker logic
- `packages/ui`, `packages/assets` – shared primitives
- `packages/*-config` – TypeScript, ESLint, and tooling configs

## Quick Start

- Install: `pnpm install`
- Dev (all): `pnpm dev`
- Dev (single app):
  - Frontend: `pnpm --filter @repo/frontend dev`
  - Farcaster: `pnpm --filter @repo/farcaster dev`

## Configuration

Do not commit secrets. Use environment files per app:

- Frontend: `apps/frontend/.env.local`
- Worker: `apps/farcaster/.dev.vars`

Common variables to set:

- `LILNOUNS_SUBGRAPH_URL`
- `BLOCKS_SUBGRAPH_URL`
- `NEXT_PUBLIC_SITE_URL`

## Scripts

- Lint: `pnpm lint`
- Test: `pnpm test` or `pnpm --filter @repo/frontend test`
- Build: `pnpm build`
- Codegen (worker): `pnpm --filter @repo/farcaster codegen`
