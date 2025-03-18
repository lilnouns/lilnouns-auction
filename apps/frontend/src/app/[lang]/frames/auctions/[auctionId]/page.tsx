import { isNumber } from 'remeda'

export const runtime = 'edge'

interface Props {
  params: Promise<{ auctionId: string }>
}

export default async function Page({ params }: Props) {
  const { auctionId } = await params

  if (!isNumber(auctionId)) {
    return <div>Invalid Auction ID</div>
  }

  return <div>Auction ID: {auctionId}</div>
}
