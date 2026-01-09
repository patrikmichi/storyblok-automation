'use client'

import { storyblokComponents } from '../generated.components'
import { useEffect } from 'react'
import styles from './default-page.module.css'

interface DefaultPageBlok {
  _uid: string
  component: 'default-page'
  meta_title?: string
  meta_description?: string
  body?: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
}

export default function DefaultPageBlok({ blok }: { blok: DefaultPageBlok }) {
  // Update document title and meta description from schema
  useEffect(() => {
    if (blok.meta_title) {
      document.title = blok.meta_title
    }
    if (blok.meta_description) {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', blok.meta_description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = blok.meta_description
        document.head.appendChild(meta)
      }
    }
  }, [blok.meta_title, blok.meta_description])

  // Default-page is a wrapper that renders the body field
  // The body contains all the actual content blocks (benefits_section, etc.)
  
  return (
    <div className={styles.page}>
      {/* Render all blocks in the body */}
      {blok.body && blok.body.length > 0 ? (
        <>
          {blok.body.map((nestedBlok) => {
            const Component = storyblokComponents[nestedBlok.component]
            
            if (!Component) {
              // Component not found
              if (process.env.NODE_ENV === 'development') {
                console.warn(`Component "${nestedBlok.component}" not found in resolver`)
              }
              return (
                <div key={nestedBlok._uid} className={styles.warning}>
                  <p className={styles.warningText}>
                    Component &quot;{nestedBlok.component}&quot; not registered
                  </p>
                </div>
              )
            }
            
            return (
              <Component key={nestedBlok._uid} blok={nestedBlok} />
            )
          })}
        </>
      ) : (
        <div className={styles.emptyState}>
          No content blocks added yet. Add components in Storyblok.
        </div>
      )}
    </div>
  )
}
