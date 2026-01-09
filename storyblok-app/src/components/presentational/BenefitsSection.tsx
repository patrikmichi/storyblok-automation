import React from 'react'
import styles from './BenefitsSection.module.css'
import { BenefitItem } from './BenefitItem'
import { SectionHeader } from './SectionHeader'

export interface BenefitsSectionProps {
  headline: string  // Main section headline
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'  // Heading tag level
  subtext?: string  // Section description/subtext
  alignment?: 'Left' | 'Center'  // Text alignment for header
  background?: 'White' | 'Grey' | 'Dark'  // Section background color
  padding_top?: number  // Padding top in pixels
  padding_bottom?: number  // Padding bottom in pixels
  benefits?: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>  // List of benefit items
  className?: string
}

/**
 * Benefits Section Component
 * @param headline - Main section headline
 * @param heading_level - Heading tag level
 * @param subtext - Section description/subtext
 * @param alignment - Text alignment for header
 * @param background - Section background color
 * @param padding_top - Padding top in pixels
 * @param padding_bottom - Padding bottom in pixels
 * @param benefits - List of benefit items
 */
export function BenefitsSection({
  headline,
  heading_level,
  subtext,
  alignment,
  background = 'White',
  padding_top = 96,
  padding_bottom = 96,
  benefits = [],
  className = '',
}: BenefitsSectionProps) {
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
          showSubtext={true}
          alignment={alignment}
          darkMode={background === 'Dark'}
        />

        {/* Benefits Grid */}
        {benefits && benefits.length > 0 && (
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <BenefitItem 
                key={benefit._uid}
                icon={benefit.icon}
                headline={benefit.headline}
                description={benefit.description}
                link={benefit.link}
                link_label={benefit.link_label}
                light_dark={benefit.light_dark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
