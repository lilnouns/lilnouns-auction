import { vazirmatn } from '@/styles/fonts'
import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => (
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
