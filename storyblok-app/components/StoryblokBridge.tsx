'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StoryblokBridge() {
  const router = useRouter()

  useEffect(() => {
    // Load Storyblok Bridge script
    const script = document.createElement('script')
    script.src = '//app.storyblok.com/f/storyblok-v2-latest.js'
    script.async = true
    
    script.onload = () => {
      // @ts-ignore
      if (window.storyblok) {
        // Get access token from environment variable (available on client via NEXT_PUBLIC_ prefix)
        const accessToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
        if (accessToken) {
          // @ts-ignore
          window.storyblok.init({
            accessToken,
          })

          // Reload on changes
          // @ts-ignore
          window.storyblok.on(['input', 'published', 'change'], (payload: any) => {
            console.log('🔄 Storyblok content changed, refreshing...', payload)
            // router.refresh() re-renders server components with fresh data
            // The server component uses Date.now() for cache busting on each render
            // Small delay ensures Storyblok has saved the changes
            setTimeout(() => {
              router.refresh()
            }, 100)
          })

          // Ping Storyblok to confirm connection
          // @ts-ignore
          window.storyblok.pingEditor(() => {
            console.log('✅ Storyblok Bridge connected - Live updates enabled')
          })
        } else {
          console.warn('⚠️ NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN not found - Bridge will not work')
        }
      }
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [router])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    storyblok?: {
      init: (config: { accessToken: string }) => void
      on: (events: string[], callback: (payload: any) => void) => void
      pingEditor: (callback: () => void) => void
    }
  }
}

