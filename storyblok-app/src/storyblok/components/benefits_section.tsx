'use client'

import { BenefitsSection } from '@/src/components/presentational/BenefitsSection'

interface BenefitsSectionBlok {
  _uid: string
  component: 'benefits_section'
  headline: string
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  subtext?: string
  alignment?: 'Left' | 'Center'
  background?: 'White' | 'Grey' | 'Dark'
  padding_top?: number
  padding_bottom?: number
  benefits?: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
}

export default function BenefitsSectionBlok({ blok }: { blok: BenefitsSectionBlok }) {
  return (
    <BenefitsSection
      headline={blok.headline}
      heading_level={blok.heading_level}
      subtext={blok.subtext}
      alignment={blok.alignment}
      background={blok.background}
      padding_top={blok.padding_top}
      padding_bottom={blok.padding_bottom}
      benefits={blok.benefits}
    />
  )
}
