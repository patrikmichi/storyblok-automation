'use client'

import { BusinessTypeCard } from '@/src/components/presentational/BusinessTypeCard'

interface BusinessTypeCardBlok {
  _uid: string
  component: 'business_type_card'
  headline: string
  description?: string
  tags?: string
  image?: {
    filename?: string
    alt?: string
  }
}

export default function BusinessTypeCardBlok({ blok }: { blok: BusinessTypeCardBlok }) {
  return (
    <BusinessTypeCard
      headline={blok.headline}
      description={blok.description}
      tags={blok.tags}
      image={blok.image}
    />
  )
}

