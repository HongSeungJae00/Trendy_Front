import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page - Trendy',
  description: 'Trendy My Page',
}

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
