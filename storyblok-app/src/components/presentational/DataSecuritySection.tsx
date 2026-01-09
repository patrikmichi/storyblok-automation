import React from 'react'
import styles from './DataSecuritySection.module.css'
import { SecurityCard } from './SecurityCard'
import { SectionHeader } from './SectionHeader'

export interface DataSecuritySectionProps {
  headline: string  // Main section headline
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'  // Heading tag level
  subtext?: string  // Section description/subtext
  show_subtext?: boolean  // Show/hide subtext
  alignment?: 'Left' | 'Center'  // Text alignment for header
  background?: 'White' | 'Grey' | 'Dark'  // Section background color
  padding_top?: number  // Padding top in pixels
  padding_bottom?: number  // Padding bottom in pixels
  security_cards: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>  // List of security certification cards
  className?: string
}

/**
 * Data Security Section Component
 * @param headline - Main section headline
 * @param heading_level - Heading tag level
 * @param subtext - Section description/subtext
 * @param show_subtext - Show/hide subtext
 * @param background - Section background color
 * @param padding_top - Padding top in pixels
 * @param padding_bottom - Padding bottom in pixels
 * @param security_cards - List of security certification cards
 */
export function DataSecuritySection({
  headline,
  heading_level,
  subtext,
  show_subtext = true,
  alignment = 'Center',
  background = 'White',
  padding_top = 96,
  padding_bottom = 96,
  security_cards,
  className = '',
}: DataSecuritySectionProps) {
  const sectionClasses = [
    styles.section,
    background === 'White' && styles.sectionWhite,
    background === 'Grey' && styles.sectionGrey,
    background === 'Dark' && styles.sectionDark,
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
          headingLevel={heading_level}
          subtext={subtext}
          showSubtext={show_subtext}
          alignment={alignment}
          darkMode={background === 'Dark'}
        />

        {/* Security Cards Grid */}
        {security_cards && security_cards.length > 0 && (
          <div className={styles.cardsGrid}>
            {security_cards.map((card) => (
              <SecurityCard 
                key={card._uid}
                image={card.image}
                headline={card.headline}
                subtext={card.subtext}
                show_subtext={card.show_subtext}
                link={card.link}
                link_label={card.link_label}
                show_link={card.show_link}
                card_type={card.card_type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
