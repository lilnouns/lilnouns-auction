export const runtime = 'edge'

export default function Page({ params }: { params: { auctionId: string } }) {
  const auctionId = Number(params.auctionId)

  if (isNaN(auctionId)) {
    return <div>Invalid Auction ID</div>
  }

  return <div>Auction ID: {auctionId}</div>
}
