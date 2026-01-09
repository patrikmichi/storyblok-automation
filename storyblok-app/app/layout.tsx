import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ReactNode } from 'react'
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'
import { storyblokComponents } from '@/src/storyblok/generated.components'

const inter = Inter({ subsets: ['latin'] })

// Initialize Storyblok - must be called at module level
// This ensures apiPlugin is loaded before getStoryblokApi is used
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || '',
  use: [apiPlugin],
  components: storyblokComponents,
  apiOptions: {
    region: (process.env.STORYBLOK_REGION as 'eu' | 'us') || 'eu',
  },
})

export const metadata: Metadata = {
  title: 'Storyblok Next.js App',
  description: 'Next.js App Router with Storyblok integration',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" style={{ background: '#ffffff' }}>
      <body className={inter.className} style={{ background: '#ffffff', color: '#161616' }}>
        {children}
      </body>
    </html>
  )
}
