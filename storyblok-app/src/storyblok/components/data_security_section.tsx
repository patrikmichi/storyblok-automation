'use client'

import { DataSecuritySection } from '@/src/components/presentational/DataSecuritySection'

interface DataSecuritySectionBlok {
  _uid: string
  component: 'data_security_section'
  headline: string
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  subtext?: string
  show_subtext?: boolean
  alignment?: 'Left' | 'Center'
  background?: 'White' | 'Grey' | 'Dark'
  padding_top?: number
  padding_bottom?: number
  security_cards: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
}

export default function DataSecuritySectionBlok({ blok }: { blok: DataSecuritySectionBlok }) {
  return (
    <DataSecuritySection
      headline={blok.headline}
      heading_level={blok.heading_level}
      subtext={blok.subtext}
      show_subtext={blok.show_subtext}
      alignment={blok.alignment}
      background={blok.background}
      padding_top={blok.padding_top}
      padding_bottom={blok.padding_bottom}
      security_cards={blok.security_cards}
    />
  )
}
