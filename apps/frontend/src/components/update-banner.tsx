import { Banner } from '@/components/banner'
import { useLingui } from '@lingui/react/macro'

export function UpdateBanner() {
  const { t } = useLingui()

  return (
    <Banner
      title="🚨 Update Available"
      description={
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {t`A new version is live. `}{' '}
          <button
            onClick={() => window.location.reload()}
            className="font-semibold underline"
          >
            {t`Reload`}
          </button>
          .
        </span>
      }
      onClose={() => console.log('Banner dismissed 😊')}
    />
  )
}
