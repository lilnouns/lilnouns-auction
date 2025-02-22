import { initLingui } from '@/i18n/init-lingui'
import { HomePage } from '@/components/home-page'

export default async function Page(props: {
  params: Promise<{ lang: string }>
}) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <HomePage />
}
