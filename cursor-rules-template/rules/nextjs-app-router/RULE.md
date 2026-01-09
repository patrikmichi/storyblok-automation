---
description: "Next.js App Router patterns and Storyblok integration standards"
globs: ["storyblok-app/app/**/*.tsx", "storyblok-app/app/**/*.ts"]
alwaysApply: false
---

# Next.js App Router Standards

## Server Components

- Use Server Components by default
- Fetch Storyblok data in Server Components
- Use `getStoryblokApi()` from `@storyblok/react/rsc`
- Handle draft mode with `draftMode()` from `next/headers`

## Dynamic Routes

- Use `app/[...slug]/page.tsx` for Storyblok pages
- Resolve slug: `const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : 'home'`
- Always use `await params` in Next.js 15+
- Set `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` for preview mode

## Metadata Generation

- Use `generateMetadata` function for dynamic metadata
- Get `meta_title` and `meta_description` from Storyblok content
- Fallback to defaults if content is missing

## Client Components

- Mark with `'use client'` directive
- Use for interactive features (Storyblok Bridge, animations)
- Keep presentational components as Server Components when possible

## Storyblok Integration

- Initialize in `app/layout.tsx` with `storyblokInit`
- Use `StoryblokStory` from `@storyblok/react/rsc` to render content
- Use `StoryblokBridge` component for live editing in preview mode
- Handle cache busting with `cv: Date.now()` in draft mode

## Environment Variables

- Use `NEXT_PUBLIC_` prefix for client-side variables
- Store tokens in `.env.local` (not committed)
- Access via `process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN`

