import linguiConfig from '@/../lingui.config'
import { loadCatalog } from '@/i18n/pages-router-i18n'
import type { GetStaticPaths } from 'next'
import { GetStaticProps } from 'next'

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

export { HomePage as default } from '@/components/home-page'
