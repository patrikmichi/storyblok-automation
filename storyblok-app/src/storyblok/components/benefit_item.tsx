'use client'

import { BenefitItem } from '@/src/components/presentational/BenefitItem'

interface BenefitItemBlok {
  _uid: string
  component: 'benefit_item'
  icon?: string
  headline: string
  description?: string
  link?: {
    url?: string
    cached_url?: string
    id?: string
    email?: string
    linktype?: string
  }
  link_label?: string
  light_dark?: 'false' | 'true'
}

export default function BenefitItemBlok({ blok }: { blok: BenefitItemBlok }) {
  return (
    <BenefitItem
      icon={blok.icon}
      headline={blok.headline}
      description={blok.description}
      link={blok.link}
      link_label={blok.link_label}
      light_dark={blok.light_dark}
    />
  )
}
