import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug') || 'home'
  const secret = searchParams.get('secret')
  
  // Verify preview secret if you have one set
  if (process.env.STORYBLOK_PREVIEW_SECRET && secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  // Redirect to the page with preview mode enabled
  const url = request.nextUrl.clone()
  url.pathname = `/${slug}`
  url.searchParams.set('_storyblok', '1')
  
  return NextResponse.redirect(url)
}

