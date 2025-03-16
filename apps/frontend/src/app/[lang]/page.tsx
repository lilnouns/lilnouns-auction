import { Metadata, ResolvingMetadata } from 'next'

import { t } from '@lingui/core/macro'
import { initLingui } from '@/i18n/init-lingui'
import { getI18nInstance } from '@/i18n/app-router-i18n'

import { HomePage } from '@/components/home-page'

export const runtime = 'edge';

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await params
  const { title } = await parent
  const i18n = getI18nInstance(lang)

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL
  const version = process.env.NEXT_PUBLIC_APP_VERSION
  const frameUrl = encodeURIComponent(`${appUrl}/?version=${version}`)
  const launchUrl = new URL(`https://warpcast.com/?launchFrameUrl=${frameUrl}`)

  return {
    title: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': `${appUrl}/opengraph-image.png`,
      'fc:frame:button:1': t(i18n)`Get Your Lil Noun`,
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': launchUrl.toString(),
    },
  }
}

async function getNextNoun() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/next-noun`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch next noun')
  return res.json() as Promise<{ nounId: bigint; price: bigint }>
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  initLingui(lang)
  const { nounId } = await getNextNoun()

  return <HomePage nounId={nounId} />
}
