'use client'

import { PrimaryButton } from '@/src/components/presentational/PrimaryButton'

interface PrimaryButtonBlok {
  _uid: string
  component: 'primary_button'
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

export default function PrimaryButtonBlok({ blok }: { blok: PrimaryButtonBlok }) {
  // Normalize variant value
  const normalizeVariant = (variant: string | undefined): 'On Dark' | 'On Light' => {
    if (!variant) return 'On Dark'
    if (variant === 'On Light') return 'On Light'
    return 'On Dark'
  }

  const variant = normalizeVariant(blok.variant)

  return (
    <PrimaryButton
      label={blok.label || 'Button'}
      link={blok.link}
      variant={variant}
    />
  )
}

