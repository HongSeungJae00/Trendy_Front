'use client'

import { usePathname } from 'next/navigation'

export default function NavigationWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')

  if (isAdminPath) {
    return null
  }

  return <>{children}</>
} 