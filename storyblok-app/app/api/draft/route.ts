import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getStoryblokApi } from '@storyblok/react/rsc'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Get params from Storyblok
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || ''
  
  // Check secret (optional security)
  if (process.env.STORYBLOK_PREVIEW_SECRET && secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Verify story exists
  const storyblokApi = getStoryblokApi()
  
  try {
    await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
    })
  } catch (error) {
    return new Response('Story not found', { status: 404 })
  }

  // Enable Draft Mode
  const draft = await draftMode()
  draft.enable()
  
  // Redirect to the story
  redirect(`/${slug}`)
}

