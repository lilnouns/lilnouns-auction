import { Metadata, ResolvingMetadata } from 'next'

import type { FrameEmbed } from '@/types'

import { t } from '@lingui/core/macro'
import { initLingui } from '@/i18n/init-lingui'
import { getI18nInstance } from '@/i18n/app-router-i18n'

import { HomePage } from '@/components/home-page'

type Props = {
  params: Promise<{ lang: string }>
}

export const runtime = 'edge'

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await params
  const { title } = await parent
  const i18n = getI18nInstance(lang)

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL
  const version = process.env.NEXT_PUBLIC_APP_VERSION

  const frame: FrameEmbed = {
    version: 'next',
    imageUrl: `${appUrl}/opengraph-image?version=${version}`,
    button: {
      action: {
        type: 'launch_frame',
        name: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
        url: `${appUrl}/${lang}/frames/?version=${version}`,
        splashImageUrl: `${appUrl}/splash.png?version=${version}`,
        splashBackgroundColor: '#f7f7f7',
      },
      title: t(i18n)`Get Your Lil Noun`,
    },
  }

  return {
    title: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
    openGraph: {
      title: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  initLingui(lang)
  return <HomePage />
}
