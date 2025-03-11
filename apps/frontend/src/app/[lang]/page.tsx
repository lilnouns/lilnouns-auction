import { Metadata, ResolvingMetadata } from 'next'

import type { FrameEmbed } from '@/types'

import { t } from '@lingui/core/macro'
import { initLingui } from '@/i18n/init-lingui'
import { getI18nInstance } from '@/i18n/app-router-i18n'

import { HomePage } from '@/components/home-page'

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

  const frame: FrameEmbed = {
    version: 'next',
    imageUrl: `${appUrl}/${lang}/opengraph-image`,
    button: {
      action: {
        type: 'launch_frame',
        name: title ? title.absolute : t(i18n)`Lil Nouns Auction`,
        url: `${appUrl}/${lang}/`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: '#f7f7f7',
      },
      title: t(i18n)`Launch Frame`,
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
