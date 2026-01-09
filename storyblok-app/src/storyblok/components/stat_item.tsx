'use client'

import { StatItem } from '@/src/components/presentational/StatItem'

interface StatItemBlok {
  _uid: string
  component: 'stat_item'
  number: string
  description: string
}

export default function StatItemBlok({ blok }: { blok: StatItemBlok }) {
  return (
    <StatItem
      number={blok.number}
      description={blok.description}
    />
  )
}
