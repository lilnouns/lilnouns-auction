import { GetStaticProps } from 'next'
import { loadCatalog } from '@/i18n/pages-router-i18n'
import { HomePage } from '@/components/home-page'

import linguiConfig from '@/../lingui.config'
import type { GetStaticPaths } from 'next'

export const getStaticPaths = (async () => {
  const paths = linguiConfig.locales.map((lang) => ({ params: { lang } }))

  return {
    paths,
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = ctx.params?.lang
  const translation = await loadCatalog(
    typeof locale === 'string' ? locale : 'en',
  )

  return {
    props: {
      translation,
    },
  }
}

export default HomePage
