import '@testing-library/jest-dom/vitest'

import { setupI18n, type MessageDescriptor } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const pushMock = vi.fn()

vi.mock('@lingui/core/macro', () => ({
  msg: (message: TemplateStringsArray | string): MessageDescriptor => {
    if (typeof message === 'string') {
      return { id: message, message }
    }
    return { id: message[0], message: message[0] }
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => '/en',
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it('lists French as an available language', async () => {
    const { LanguageSwitcher } = await import('./language-switcher')
    const i18n = setupI18n({
      locale: 'en',
      messages: {
        en: {
          English: 'English',
          Spanish: 'Spanish',
          French: 'French',
          Italian: 'Italian',
          Portuguese: 'Portuguese',
        },
      },
    })

    render(
      <I18nProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nProvider>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('French')).toBeInTheDocument()
  })
})
