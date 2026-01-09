import React from 'react'
import styles from './StatsSection.module.css'
import { StatItem } from './StatItem'
import { SectionHeader } from './SectionHeader'

export interface StatsSectionProps {
  headline: string  // Main section headline
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'  // Heading tag level
  subtext?: string  // Section description/subtext
  show_subtext?: boolean  // Show/hide subtext
  alignment?: 'Left' | 'Center'  // Text alignment for header
  background_color?: 'White' | 'Grey' | 'Dark'  // Section background color
  stats: Array<{
    _uid: string
    component: string
    [key: string]: any
  }>  // List of stat items
  className?: string
}

/**
 * Stats Section Component
 * @param headline - Main section headline
 * @param heading_level - Heading tag level
 * @param subtext - Section description/subtext
 * @param show_subtext - Show/hide subtext
 * @param background_color - Section background color
 * @param stats - List of stat items
 */
export function StatsSection({
  headline,
  heading_level,
  subtext,
  show_subtext = true,
  alignment = 'Center',
  background_color = 'White',
  stats,
  className = '',
}: StatsSectionProps) {
  const sectionClasses = [
    styles.section,
    background_color === 'White' && styles.sectionWhite,
    background_color === 'Grey' && styles.sectionGrey,
    background_color === 'Dark' && styles.sectionDark,
    className,
  ].filter(Boolean).join(' ')

  const statsClasses = [
    styles.stats,
    background_color === 'Dark' && styles.statsDark,
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={sectionClasses}
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
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
          darkMode={background_color === 'Dark'}
        />

        {/* Stats Grid */}
        {stats && stats.length > 0 && (
          <div className={statsClasses}>
            {stats.map((stat) => (
              <StatItem 
                key={stat._uid}
                number={stat.number}
                description={stat.description}
                className={background_color === 'Dark' ? styles.statItemDark : ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
