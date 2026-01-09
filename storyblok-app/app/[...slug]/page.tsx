import { getStoryblokApi, StoryblokStory } from '@storyblok/react/rsc'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import StoryblokBridge from '@/components/StoryblokBridge'
import type { Metadata } from 'next'
import styles from './page.module.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const draft = await draftMode()
  const isEnabled = draft.isEnabled
  const resolvedParams = await params
  const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : 'home'

  const storyblokApi = getStoryblokApi()

  try {
    const response = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: isEnabled ? 'draft' : 'published',
      cv: isEnabled ? Date.now() : undefined,
    })
    
    const story = response.data?.story
    const content = story?.content

    return {
      title: content?.meta_title || story?.name || 'Storyblok Next.js App',
      description: content?.meta_description || 'Next.js App Router with Storyblok integration',
    }
  } catch (error) {
    return {
      title: 'Storyblok Next.js App',
      description: 'Next.js App Router with Storyblok integration',
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const draft = await draftMode()
  const isEnabled = draft.isEnabled
  const resolvedParams = await params
  const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : 'home'

  const storyblokApi = getStoryblokApi()

  let data
  try {
    // Enhanced cache busting: always use fresh timestamp for draft mode
    // Date.now() is evaluated fresh on each server component render
    // This ensures router.refresh() fetches new data from Storyblok API
    const cacheVersion = isEnabled ? Date.now() : undefined
    
    const response = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: isEnabled ? 'draft' : 'published',
      cv: cacheVersion, // Cache busting for draft - fresh timestamp on every render
      resolve_relations: 'benefits_section.benefits,business_types_section.business_cards',
    })
    data = response.data
  } catch (error) {
    console.error('Error fetching story:', error)
    notFound()
  }

  return (
    <div className={styles.page}>
      {/* Draft mode indicator */}
      {isEnabled && (
        <div className={styles.draftBanner}>
          📝 Preview Mode | 
          <a href="/api/exit-draft" className={styles.draftLink}>
            Exit Preview
          </a>
        </div>
      )}

      {/* Render story */}
      <StoryblokStory story={data.story} />

      {/* Bridge for live editing */}
      {isEnabled && <StoryblokBridge />}
    </div>
  )
}

// Disable caching for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0
