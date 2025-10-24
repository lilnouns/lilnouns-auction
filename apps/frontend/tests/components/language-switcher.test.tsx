import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from '@/components/language-switcher'

const pushMock = vi.fn()

vi.mock('@lingui/core/macro', () => ({
  msg: (message: TemplateStringsArray) => message[0],
}))

vi.mock('@lingui/react', () => ({
  useLingui: () => ({
    i18n: {
      _: (message: string) => message,
    },
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => '/en',
}))

vi.mock('@repo/ui/components/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: ReactNode
    onClick: () => void
  }) => (
    <div onClick={onClick} role="button">
      {children}
    </div>
  ),
}))

vi.mock('@repo/ui/components/button', () => ({
  Button: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('includes the Chinese language option', () => {
    render(<LanguageSwitcher />)

    expect(screen.getByText('Chinese')).toBeInTheDocument()
  })

  it('includes the French language option and navigates to the locale route', () => {
    render(<LanguageSwitcher />)

    const frenchOption = screen.getAllByText('French')[0]
    expect(frenchOption).toBeInTheDocument()

    frenchOption.click()

    expect(pushMock).toHaveBeenCalledWith('/fr/')
  })
})
