'use client'

import { SecondaryButton } from '@/src/components/presentational/SecondaryButton'

interface SecondaryButtonBlok {
  _uid: string
  component: 'secondary_button'
  label: string
  link?: {
    url?: string
    cached_url?: string
    id?: string
    email?: string
    linktype?: string
  }
  variant?: 'On Dark' | 'On Light'
}

export default function SecondaryButtonBlok({ blok }: { blok: SecondaryButtonBlok }) {
  // Normalize variant value
  const normalizeVariant = (variant: string | undefined): 'On Dark' | 'On Light' => {
    if (!variant) return 'On Dark'
    if (variant === 'On Light') return 'On Light'
    return 'On Dark'
  }

  const variant = normalizeVariant(blok.variant)

  return (
    <SecondaryButton
      label={blok.label || 'Button'}
      link={blok.link}
      variant={variant}
    />
  )
}

