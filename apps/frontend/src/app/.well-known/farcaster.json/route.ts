export const runtime = 'edge';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL
  const accountAssociation =
    process.env.NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION

  const config = {
    accountAssociation,
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
