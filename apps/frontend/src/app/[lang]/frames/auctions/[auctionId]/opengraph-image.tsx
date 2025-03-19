import { ImageResponse } from 'next/og'
import { formatEther } from 'viem'

export const runtime = 'edge'

// Image metadata
export const alt = 'Lil Nouns Auction'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

type AuctionResponse = {
  data: {
    auction: {
      id: string
      noun: {
        id: string
        seed: {
          id: string
          background: string
          body: string
          accessory: string
          head: string
          glasses: string
        }
      }
      amount: string
    } | null
  }
}

export async function fetchLilNounsAuction(
  auctionId: string,
): Promise<AuctionResponse['data']['auction'] | undefined> {
  try {
    const endpoint = process.env.NEXT_PUBLIC_LILNOUNS_SUBGRAPH_URL ?? ''
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `{
          auction(id: "${auctionId}") {
            id
            noun {
              id
              seed {
                id
                background
                body
                accessory
                head
                glasses
              }
            }
            amount
          }
        }`,
        variables: {},
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const result: AuctionResponse = await response.json()
    return result.data.auction ?? undefined
  } catch (error) {
    console.error('Error fetching auction data:', error)
    return undefined
  }
}

interface Props {
  params: Promise<{ auctionId: string }>
}

// Image generation
export default async function Image({ params }: Props) {
  const { auctionId } = await params

  if (isNaN(Number(auctionId))) {
    return new Response('Invalid Auction ID', { status: 400 })
  }

  const auction = await fetchLilNounsAuction(auctionId)

  // const vazirmatnSemiBoldResp = await fetch(
  //   new URL('../../styles/fonts/Vazirmatn/Vazirmatn-Bold.ttf', import.meta.url),
  // )

  // const vazirmatnSemiBoldFontArray = await vazirmatnSemiBoldResp.arrayBuffer()

  const svg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDVkN2UxIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjYwIiBmaWxsPSIjZWVkODExIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjcwIiBmaWxsPSIjZWVkODExIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIyODAiIGZpbGw9IiNlZWQ4MTEiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI4MCIgZmlsbD0iI2VlZDgxMSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjkwIiBmaWxsPSIjZWVkODExIiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyOTAiIGZpbGw9IiNlZWQ4MTEiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjMwMCIgZmlsbD0iI2VlZDgxMSIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMzAwIiBmaWxsPSIjZWVkODExIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIzMTAiIGZpbGw9IiNlZWQ4MTEiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjMxMCIgZmlsbD0iI2VlZDgxMSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjI2MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjI3MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMjgwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyODAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjI5MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjkwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIzMDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjMwMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMzEwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIzMTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjEwMCIgZmlsbD0iIzZiNzIxMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTAwIiBmaWxsPSIjYWE5NDBjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMDAiIGZpbGw9IiM2YjcyMTIiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjExMCIgZmlsbD0iIzZiNzIxMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTEwIiBmaWxsPSIjYWE5NDBjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMTAiIGZpbGw9IiM2YjcyMTIiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjEyMCIgZmlsbD0iIzZiNzIxMiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTIwIiBmaWxsPSIjYWE5NDBjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMjAiIGZpbGw9IiM2YjcyMTIiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTMwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIxMzAiIGZpbGw9IiM2YjcyMTIiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEzMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxNDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjE0MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTQwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjE1MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTUwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIxNTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE1MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTUwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjUwIiB5PSIxNTAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTYwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE2MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxNjAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjE2MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTYwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxNjAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjE2MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxNzAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTcwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE3MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMTcwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNzAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjE3MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjI1MCIgeT0iMTcwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjE4MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxODAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTgwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIxODAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE4MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTgwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjUwIiB5PSIxODAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTkwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE5MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxOTAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjE5MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTkwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxOTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjE5MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIyMDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjAwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIwMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjAwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjIwMCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjI1MCIgeT0iMjAwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjIxMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIyMTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjEwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyMTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjIxMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMjEwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjUwIiB5PSIyMTAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMjIwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjIyMCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMjAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjIyMCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjIwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIyMjAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjIyMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIyMzAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjMwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIzMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMjMwIiBmaWxsPSIjNGQyNzFiIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyMzAiIGZpbGw9IiNmZmU5MzkiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIzMCIgZmlsbD0iIzRkMjcxYiIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjMwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIyMzAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjIzMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIyNDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjQwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI0MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjQwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyNDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjI0MCIgZmlsbD0iI2JkMmQyNCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjI1MCIgeT0iMjQwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjI1MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIyNTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyNTAiIGZpbGw9IiNiZDJkMjQiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjI1MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMjUwIiBmaWxsPSIjYmQyZDI0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjUwIiB5PSIyNTAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTQwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNDAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTUwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNTAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE1MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjE1MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNjAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTYwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE2MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTYwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE2MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTYwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE3MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxNzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE3MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTcwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE3MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTcwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE4MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxODAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTgwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE4MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTgwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxODAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE4MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTgwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE5MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxOTAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMTkwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxOTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE5MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTkwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxOTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE5MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI0MCIgeT0iMTkwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjIwMCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjIwMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjAwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMDAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjIwMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMjAwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIyMDAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjEwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMTAiIGZpbGw9IiNkMTlhNTQiIC8+PC9zdmc+`

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: '#472A91',
        }}
      >
        <div
          style={{
            backgroundImage: `url('${svg}')`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundSize: '1200 1200',
            backgroundRepeat: 'no-repeat',
            filter: 'opacity(30%) grayscale(0%) blur(4px)',
            zIndex: -1,
          }}
        ></div>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '0rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
          }}
        >
          Lil Nouns #{auction?.id}
        </h1>
        <h2
          style={{
            fontSize: '1.9rem',
            fontWeight: '500',
            color: '#fff',
            marginBottom: '0rem',
          }}
        >
          Auction Price: Ξ {formatEther(BigInt(auction?.amount ?? 0n))}
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <img
            width="320"
            height="320"
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            src={svg}
          />
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      // fonts: [
      //   {
      //     name: 'Vazirmatn',
      //     data: vazirmatnSemiBoldFontArray,
      //     style: 'normal',
      //     weight: 400,
      //   },
      // ],
    },
  )
}
