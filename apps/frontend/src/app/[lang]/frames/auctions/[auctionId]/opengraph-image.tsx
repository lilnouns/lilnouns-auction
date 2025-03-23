import { ImageResponse } from 'next/og'
import { formatEther } from 'viem'

import { Seed } from '@/types'
import { getNounData, imageData } from '@repo/assets/index'
import { buildSVG, EncodedImage } from '@lilnounsdao/sdk'

const { palette } = imageData

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
        seed: Seed
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
    const query = `{
          auction(id: "${auctionId}") {
            id
            noun {
              id
              seed {
                background
                body
                accessory
                head
                glasses
              }
            }
            amount
          }
        }`
    console.log(query)
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
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

  const renderSVG = (seed: Seed) => {
    const { parts, background } = getNounData(seed)
    const validParts = parts.filter(
      (part): part is NonNullable<typeof part> => part !== undefined,
    )

    const formattedParts: EncodedImage[] = validParts.map((part) => ({
      data: part.data,
      filename: part.filename || '', // Add filename if it's required by EncodedImage type
    }))

    const svgBinary = buildSVG(formattedParts, palette, background!)
    return btoa(svgBinary)
  }

  const seed = auction?.noun?.seed

  if (!seed) {
    return new Response('No seed data available', { status: 404 })
  }

  const svg = `data:image/svg+xml;base64,${renderSVG(seed)}`

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
          Auction Price: Ξ{' '}
          {Number(formatEther(BigInt(auction?.amount ?? 0n))).toFixed(5)}
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
