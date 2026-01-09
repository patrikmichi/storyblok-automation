import { BusinessTypeCard, BusinessTypeCardProps } from './BusinessTypeCard'
import styles from './BusinessTypesSection.module.css'
import { SectionHeader } from './SectionHeader'

export interface BusinessTypesSectionProps {
  headline: string
  subtext?: string
  showSubtext?: boolean
  alignment?: 'Left' | 'Center'  // Text alignment for header
  background?: 'White' | 'Grey'
  businessCards: BusinessTypeCardProps[]
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  padding_top?: number
  padding_bottom?: number
  className?: string
}

export function BusinessTypesSection({
  headline,
  subtext,
  showSubtext = true,
  alignment = 'Center',
  background = 'White',
  businessCards = [],
  headingLevel = 'h2',
  padding_top = 96,
  padding_bottom = 96,
  className = '',
}: BusinessTypesSectionProps) {
  const sectionClasses = [
    styles.section,
    background === 'White' && styles.sectionWhite,
    background === 'Grey' && styles.sectionGrey,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={sectionClasses}
      style={{
        paddingTop: `${padding_top}px`,
        paddingBottom: `${padding_bottom}px`,
      }}
    >
      <div className={styles.container}>
        {/* Header */}
        <SectionHeader
          headline={headline}
          headingLevel={headingLevel}
          subtext={subtext}
          showSubtext={showSubtext}
          alignment={alignment}
          darkMode={false}
        />

        {/* Cards Grid - 2 columns: 592px × 2 + 32px gap = 1216px */}
        {businessCards.length > 0 && (
          <div className={styles.cardsGrid}>
            {businessCards.map((card, index) => (
              <BusinessTypeCard
                key={index}
                {...card}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

