import { getRequestContext } from '@cloudflare/next-on-pages'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { fetchBlocks } from '@shared/services'
import { getNounSeedFromBlockHash } from '@shared/utilities'
import { type NextRequest } from 'next/server'
import { map, pipe } from 'remeda'

export const runtime = 'edge'

interface Seed {
  background: number
  body: number
  accessory: number
  head: number
  glasses: number
}

interface SeedResult {
  blockNumber: number
  seed: Seed | undefined
}

interface SeedParams {
  params: { noun: number }
}

/**
 * Handles GET requests to fetch a list of noun seeds based on specific
 * filtering criteria. Fetches blocks in batches and extracts seeds from block
 * hashes based on the provided parameters.
 *
 * @param request - The incoming request object.
 * @param params.params
 * @param params - An object containing route parameters.
 * @param params.noun - The noun parameter used to generate seeds.
 * @param params.params.noun
 * @returns A promise that resolves to a Response object containing the list of
 *   seeds matching the filter criteria.
 */
export async function GET(
  request: NextRequest,
  { params: { noun } }: SeedParams,
) {
  const { env } = getRequestContext()

  const { searchParams } = request.nextUrl
  const seedCache = Number(searchParams.get('cache'))
  const seedLimit = Number(searchParams.get('limit') ?? '256')
  let seedOffset = Number(searchParams.get('offset') ?? '0')
  let blockOffset = 0

  try {
    const filterParams: Partial<Seed> = {
      background: searchParams.get('background')
        ? +searchParams.get('background')!
        : undefined,
      body: searchParams.get('body') ? +searchParams.get('body')! : undefined,
      accessory: searchParams.get('accessory')
        ? +searchParams.get('accessory')!
        : undefined,
      head: searchParams.get('head') ? +searchParams.get('head')! : undefined,
      glasses: searchParams.get('glasses')
        ? +searchParams.get('glasses')!
        : undefined,
    }

    let seedResults: SeedResult[] = []

    switch (seedCache) {
      case 0: {
        const blocks = await fetchBlocks(env, blockOffset)

        const newSeedResults = await Promise.all(
          blocks.slice(0, 256).map(async (block) => {
            try {
              const seed = getNounSeedFromBlockHash(noun, block.id)
              const isMatching = Object.entries(filterParams).every(
                ([key, value]) =>
                  value === undefined || seed[key as keyof Seed] === value,
              )

              return isMatching
                ? { blockNumber: block.number, seed }
                : { blockNumber: block.number, seed: undefined }
            } catch (error) {
              if (error instanceof Error) {
                console.error(
                  `Error generating seed for block ${block.id}:`,
                  error.message,
                )
              } else {
                console.error(
                  `An unknown error occurred while generating seed for block ${block.id}:`,
                  error,
                )
              }
              return { blockNumber: block.number, seed: undefined }
            }
          }),
        )

        seedResults = [
          ...seedResults,
          ...newSeedResults.filter(
            (result): result is SeedResult => result.seed !== undefined,
          ),
        ]

        break
      }
      case 1: {
        const adapter = new PrismaD1(env.DB)
        const prisma = new PrismaClient({ adapter })

        const seeds = await prisma.seed.findMany({
          where: { nounId: noun, ...filterParams },
          take: seedLimit,
          include: { block: true },
          orderBy: { block: { number: 'desc' } },
        })

        seedResults = pipe(
          seeds,
          map((seed) => ({
            blockNumber: Number(seed.block.number),
            seed: {
              background: Number(seed.background),
              body: Number(seed.body),
              accessory: Number(seed.accessory),
              head: Number(seed.head),
              glasses: Number(seed.glasses),
            },
          })),
        )

        break
      }
      case 2: {
        const adapter = new PrismaD1(env.DB)
        const prisma = new PrismaClient({ adapter })

        const blocks = await prisma.block.findMany({
          orderBy: { number: 'desc' },
          take: 200,
        })

        const newSeedResults = await Promise.all(
          blocks.map(async (block) => {
            const blockNumber = Number(block.number)
            try {
              const seed = getNounSeedFromBlockHash(noun, block.id)
              const isMatching = Object.entries(filterParams).every(
                ([key, value]) =>
                  value === undefined || seed[key as keyof Seed] === value,
              )

              return isMatching
                ? { blockNumber, seed }
                : { blockNumber, seed: undefined }
            } catch (error) {
              if (error instanceof Error) {
                console.error(
                  `Error generating seed for block ${block.id}:`,
                  error.message,
                )
              } else {
                console.error(
                  `An unknown error occurred while generating seed for block ${block.id}:`,
                  error,
                )
              }
              return { blockNumber, seed: undefined }
            }
          }),
        )

        seedResults = [
          ...seedResults,
          ...newSeedResults.filter(
            (result): result is SeedResult => result.seed !== undefined,
          ),
        ]

        break
      }
    }

    return new Response(
      JSON.stringify({
        noun,
        seeds: seedResults.slice(seedOffset, seedOffset + seedLimit),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timed out') {
      return new Response('Request timed out', { status: 504 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
