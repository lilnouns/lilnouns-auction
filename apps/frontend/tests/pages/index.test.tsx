import Home, { getStaticProps } from '@/pages/index'
import { getLocale, loadCatalog } from '@/utils/locales'
import { act, render } from '@testing-library/react'
import { useRouter } from 'next/router'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/router', () => ({
  __esModule: true,
  useRouter: vi.fn(),
}))

vi.mock('@/utils/locales', () => ({
  __esModule: true,
  getLocale: vi.fn(),
  loadCatalog: vi.fn(),
}))

describe('Home', () => {
  const mockReplace = vi.fn()
  const useRouterMock = useRouter as unknown as Mock
  const getLocaleMock = getLocale as unknown as Mock
  const loadCatalogMock = loadCatalog as unknown as Mock

  beforeEach(() => {
    useRouterMock.mockReturnValue({
      replace: mockReplace,
    })
    getLocaleMock.mockReturnValue('en')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to locale-specific page on mount', () => {
    act(() => {
      render(<Home />)
    })

    expect(mockReplace).toHaveBeenCalledWith('/en')
  })

  it('gets static props correctly', async () => {
    loadCatalogMock.mockResolvedValue({ hello: 'world' })

    const props = await getStaticProps()

    expect(props).toEqual({
      props: {
        translation: { hello: 'world' },
      },
    })
  })
})
