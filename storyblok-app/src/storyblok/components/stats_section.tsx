'use client'

import { StatsSection } from '@/src/components/presentational/StatsSection'

interface StatsSectionBlok {
  _uid: string
  component: 'stats_section'
  headline: string
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  subtext?: string
  show_subtext?: boolean
  alignment?: 'Left' | 'Center'
  background_color?: 'White' | 'Grey' | 'Dark'
  stats: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
}

export default function StatsSectionBlok({ blok }: { blok: StatsSectionBlok }) {
  return (
    <StatsSection
      headline={blok.headline}
      heading_level={blok.heading_level}
      subtext={blok.subtext}
      show_subtext={blok.show_subtext}
      alignment={blok.alignment}
      background_color={blok.background_color}
      stats={blok.stats}
    />
  )
}
