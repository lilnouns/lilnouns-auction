export const runtime = 'edge'

interface Props {
  params: { auctionId: string }
}

export default function Page({ params }: Props) {
  const auctionId = Number(params.auctionId)

  if (isNaN(auctionId)) {
    return <div>Invalid Auction ID</div>
  }

  return <div>Auction ID: {auctionId}</div>
}
