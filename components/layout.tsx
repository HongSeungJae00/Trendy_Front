'use client'

import { Sidebar } from '@/components/sidebar'
import CenterSidebar from "@/components/center_sidebar"
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const pathname = usePathname()
  const isSupport = pathname.includes('/support')
  const isNotice = pathname.includes('/notice')
  const shouldUseCenterSidebar = isSupport || isNotice
  const shouldShowSidebar = showSidebar

  return (
    <div className="min-h-screen">
      <div className="flex">
        {shouldShowSidebar && (
          shouldUseCenterSidebar ? <CenterSidebar /> : <Sidebar onItemClick={() => {}} />
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

