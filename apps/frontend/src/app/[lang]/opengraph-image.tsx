import { ImageResponse } from 'next/og'

// export const runtime = 'edge'

interface ImageConfig {
  dimensions: {
    width: number
    height: number
  }
  theme: {
    colors: {
      background: string
      text: string
    }
    typography: {
      headingSize: string
    }
    layout: {
      fullSize: '100%'
    }
  }
}

const imageConfig: ImageConfig = {
  dimensions: {
    width: 600,
    height: 400,
  },
  theme: {
    colors: {
      background: '#f0ecf9',
      text: '#131314',
    },
    typography: {
      headingSize: '3.75rem',
    },
    layout: {
      fullSize: '100%',
    },
  },
}

const layoutStyles = {
  container: {
    height: imageConfig.theme.layout.fullSize,
    width: imageConfig.theme.layout.fullSize,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: imageConfig.theme.colors.background,
  },
  heading: {
    fontSize: imageConfig.theme.typography.headingSize,
    color: imageConfig.theme.colors.text,
  },
} as const

export const size = imageConfig.dimensions

export default async function AuctionImageGenerator() {
  return new ImageResponse(
    (
      <div style={layoutStyles.container}>
        <h1 style={layoutStyles.heading}>Lil Nouns Auction</h1>
      </div>
    ),
    {
      ...size,
    },
  )
}
