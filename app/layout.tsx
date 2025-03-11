import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Navigation from '@/components/navigation'
import NavigationWrapper from '../components/navigation-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Product Page',
  description: 'Product page for e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://cdn.iamport.kr/v1/iamport.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
        {children}
      </body>
    </html>
  )
}
