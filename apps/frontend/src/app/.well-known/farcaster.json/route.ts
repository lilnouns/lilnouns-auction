export const runtime = 'edge'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL

  const config = {
    accountAssociation: {
      header:
        'eyJmaWQiOjE3ODM4LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4YzE2Rjc0ODQzMDZFY2IzNjFDNjhlMmE3N2YyNThEYWQ2RTc3NTBBOCJ9',
      payload: 'eyJkb21haW4iOiJzZXBvbGlhLmxpbG5vdW5zLmF1Y3Rpb24ifQ',
      signature:
        'MHgzN2E3NDhjNWY2NzQxODVjOTFhYmZkOTE3M2RjZTM3ZmZjYTZmM2M2NWZhNWIzOTBhNmI4YjE1OWY4ODU3NDczNjQ5ZGE4ODMxMjVjZjljN2ZmNTI3ZDczMzM2Mjk3NmY3YjY3MGMyYjNmMzcxZjY1N2JmYzkwYTM4OWUxNDhhNzFj',
    },
    frame: {
      version: '1',
      name: 'Lil Nouns Auction',
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: `${appUrl}`,
      imageUrl: `${appUrl}/image.png`,
      buttonTitle: 'Get Your Lil Noun',
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#eeccff',
      webhookUrl: `${appUrl}/api/webhook`,
    },
  }

  return Response.json(config)
}
