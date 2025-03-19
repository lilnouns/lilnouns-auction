export const runtime = 'edge'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL
  const version = process.env.NEXT_PUBLIC_APP_VERSION
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  let accountAssociation = {}

  if (chainId === '1') {
    accountAssociation = {
      header:
        'eyJmaWQiOjE3ODM4LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4YzE2Rjc0ODQzMDZFY2IzNjFDNjhlMmE3N2YyNThEYWQ2RTc3NTBBOCJ9',
      payload: 'eyJkb21haW4iOiJsaWxub3Vucy5hdWN0aW9uIn0',
      signature:
        'MHgwOTcyNjE5YzE5YmU3NTc0ZDExZDUwMDkyMTk3ODJkMzg3MjA0OTNlMjVkZmE1MTdlMGNhYTYxMjlmMTVhNDZmMDI2YmVkM2YzZjZjOTk4NTU4Nzc4ZTUwODg4MDlhMTQ0Nzg1ZDM0NDk4Y2YxNDc1MDFmZDYyMTUyNjZlY2UxMDFj',
    }
  } else {
    accountAssociation = {
      header:
        'eyJmaWQiOjE3ODM4LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4YzE2Rjc0ODQzMDZFY2IzNjFDNjhlMmE3N2YyNThEYWQ2RTc3NTBBOCJ9',
      payload: 'eyJkb21haW4iOiJzZXBvbGlhLmxpbG5vdW5zLmF1Y3Rpb24ifQ',
      signature:
        'MHgzN2E3NDhjNWY2NzQxODVjOTFhYmZkOTE3M2RjZTM3ZmZjYTZmM2M2NWZhNWIzOTBhNmI4YjE1OWY4ODU3NDczNjQ5ZGE4ODMxMjVjZjljN2ZmNTI3ZDczMzM2Mjk3NmY3YjY3MGMyYjNmMzcxZjY1N2JmYzkwYTM4OWUxNDhhNzFj',
    }
  }

  const config = {
    accountAssociation,
    frame: {
      version: '1',
      name: 'Lil Nouns Auction',
      iconUrl: `${appUrl}/icon.png?version=${version}`,
      homeUrl: `${appUrl}`,
      imageUrl: `${appUrl}/image.png?version=${version}`,
      buttonTitle: 'Get Your Lil Noun',
      splashImageUrl: `${appUrl}/splash.png?version=${version}`,
      splashBackgroundColor: '#472A91',
      webhookUrl: `${appUrl}/api/webhook`,
    },
  }

  return Response.json(config)
}
