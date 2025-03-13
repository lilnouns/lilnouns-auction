import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'Lil Nouns Auction'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  // const vazirmatnSemiBoldResp = await fetch(
  //   new URL('../../styles/fonts/Vazirmatn/Vazirmatn-Bold.ttf', import.meta.url),
  // )

  // const vazirmatnSemiBoldFontArray = await vazirmatnSemiBoldResp.arrayBuffer()

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          color: '#131314',
          fontSize: 128,
          background: '#f0ecf9',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Lil Nouns Auction
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
