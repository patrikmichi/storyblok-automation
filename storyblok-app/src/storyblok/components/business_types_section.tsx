'use client'

import { BusinessTypesSection } from '@/src/components/presentational/BusinessTypesSection'

interface BusinessTypesSectionBlok {
  _uid: string
  component: 'business_types_section'
  headline: string
  subtext?: string
  show_subtext?: boolean
  alignment?: 'Left' | 'Center'
  background?: 'White' | 'Grey'
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  padding_top?: number
  padding_bottom?: number
  business_cards?: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
}

export default function BusinessTypesSectionBlok({ blok }: { blok: BusinessTypesSectionBlok }) {
  // Normalize background value from Storyblok (handle case variations)
  const normalizeBackground = (bg: string | undefined): 'White' | 'Grey' => {
    if (!bg) return 'White'
    const normalized = bg.charAt(0).toUpperCase() + bg.slice(1).toLowerCase()
    if (normalized === 'White' || normalized === 'Grey') {
      return normalized
    }
    return 'White'
  }

  const background = normalizeBackground(blok.background)

  // Process nested business type cards - map to props format
  const businessCards = (blok.business_cards || []).map((item) => ({
    headline: item.headline || '',
    description: item.description,
    tags: item.tags,
    image: item.image,
  }))

  return (
    <BusinessTypesSection
      headline={blok.headline}
      subtext={blok.subtext}
      showSubtext={blok.show_subtext !== false}
      alignment={blok.alignment}
      background={background}
      businessCards={businessCards}
      headingLevel={blok.heading_level || 'h2'}
      padding_top={blok.padding_top}
      padding_bottom={blok.padding_bottom}
    />
  )
}

