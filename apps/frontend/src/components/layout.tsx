import { vazirmatn } from '@/styles/fonts'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <style jsx global>{`
      html {
        font-family: ${vazirmatn.style.fontFamily};
      }
    `}</style>
    <main>{children}</main>
  </>
)

export default Layout
