'use client'

import { SecurityCard } from '@/src/components/presentational/SecurityCard'

interface SecurityCardBlok {
  _uid: string
  component: 'security_card'
  image?: string
  headline: string
  subtext?: string
  show_subtext?: boolean
  link?: {
    url?: string
    cached_url?: string
    id?: string
    email?: string
    linktype?: string
  }
  link_label?: string
  show_link?: boolean
  card_type?: 'Shadow' | 'Border' | 'Dark'
}

export default function SecurityCardBlok({ blok }: { blok: SecurityCardBlok }) {
  return (
    <SecurityCard
      image={blok.image}
      headline={blok.headline}
      subtext={blok.subtext}
      show_subtext={blok.show_subtext}
      link={blok.link}
      link_label={blok.link_label}
      show_link={blok.show_link}
      card_type={blok.card_type}
    />
  )
}
