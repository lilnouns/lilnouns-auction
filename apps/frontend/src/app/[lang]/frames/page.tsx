import { Metadata, ResolvingMetadata } from 'next'

import type { FrameEmbed } from '@/types'

import { t } from '@lingui/core/macro'
import { initLingui } from '@/i18n/init-lingui'
import { getI18nInstance } from '@/i18n/app-router-i18n'

import { HomePage } from '@/components/home-page'

type Props = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const runtime = 'edge'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await params
  const { title } = await parent
  const { fv } = await searchParams

  const i18n = getI18nInstance(lang)

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION
  const frameVersion = (
    fv ??
    process.env.NEXT_PUBLIC_FRAME_VERSION ??
    '1'
  ).toString()

  const frame: FrameEmbed = {
    version: 'next',
    imageUrl: `${appUrl}/opengraph-image?version=${appVersion}`,
    button: {
      action: {
        type: 'launch_frame',
        name: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
        url: `${appUrl}/${lang}/frames/?version=${appVersion}`,
        splashImageUrl: `${appUrl}/splash.png?version=${appVersion}`,
        splashBackgroundColor: '#f7f7f7',
      },
      title: t(i18n)`Get Your Lil Noun`,
    },
  }

  const appHost = new URL(appUrl ?? '').host
  const launchUrl = `https://warpcast.com/~/frames/launch?domain=${appHost}&version=${appVersion}`

  return {
    title: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
    openGraph: {
      title: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
    },
    other: {
      ...(frameVersion !== '1'
        ? {
            'fc:frame': JSON.stringify(frame),
          }
        : {
            'fc:frame': 'vNext',
            'fc:frame:image': frame.imageUrl,
            'fc:frame:button:1': frame.button.title,
            'fc:frame:button:1:action': 'link',
            'fc:frame:button:1:target': launchUrl.toString(),
          }),
    },
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  initLingui(lang)
  return <HomePage />
}
