'use client'

import { CTASection } from '@/src/components/presentational/CTASection'
import { storyblokComponents } from '../generated.components'
import type { PrimaryButtonProps } from '@/src/components/presentational/PrimaryButton'
import type { SecondaryButtonProps } from '@/src/components/presentational/SecondaryButton'

interface CTASectionBlok {
  _uid: string
  component: 'cta_section'
  headline: string
  subtext?: string
  show_subtext?: boolean
  primary_button?: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
  secondary_button?: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>
  container?: 'Container' | 'FW'
  graphics?: 'Opacity' | 'Colors'
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  padding_top?: number
  padding_bottom?: number
}

export default function CTASectionBlok({ blok }: { blok: CTASectionBlok }) {
  // Normalize container value
  const normalizeContainer = (container: string | undefined): 'Container' | 'FW' => {
    if (!container) return 'Container'
    if (container === 'FW' || container === 'Full Width') return 'FW'
    return 'Container'
  }

  // Normalize graphics value
  const normalizeGraphics = (graphics: string | undefined): 'Opacity' | 'Colors' => {
    if (!graphics) return 'Colors'
    if (graphics === 'Opacity') return 'Opacity'
    return 'Colors'
  }

  const container = normalizeContainer(blok.container)
  const graphics = normalizeGraphics(blok.graphics)

  // Process primary button
  const primaryButton: PrimaryButtonProps | undefined = blok.primary_button?.[0] ? {
    label: blok.primary_button[0].label || 'Button',
    link: blok.primary_button[0].link,
    variant: blok.primary_button[0].variant || 'On Dark',
  } : undefined

  // Process secondary button
  const secondaryButton: SecondaryButtonProps | undefined = blok.secondary_button?.[0] ? {
    label: blok.secondary_button[0].label || 'Button',
    link: blok.secondary_button[0].link,
    variant: blok.secondary_button[0].variant || 'On Dark',
  } : undefined

  return (
    <CTASection
      headline={blok.headline}
      subtext={blok.subtext}
      showSubtext={blok.show_subtext !== false}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      container={container}
      graphics={graphics}
      headingLevel={blok.heading_level || 'h2'}
      padding_top={blok.padding_top}
      padding_bottom={blok.padding_bottom}
    />
  )
}

