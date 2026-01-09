import React from 'react'
import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  headline: string
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  subtext?: string
  showSubtext?: boolean
  alignment?: 'Left' | 'Center'
  darkMode?: boolean
  className?: string
}

export function SectionHeader({
  headline,
  headingLevel = 'h2',
  subtext,
  showSubtext = true,
  alignment = 'Center',
  darkMode = false,
  className = '',
}: SectionHeaderProps) {
  const HeadingTag = headingLevel as keyof React.JSX.IntrinsicElements

  const headerWrapperClasses = [
    styles.headerWrapper,
    alignment === 'Center' ? styles.headerWrapperCenter : styles.headerWrapperLeft,
    className,
  ].filter(Boolean).join(' ')

  const headerClasses = [
    styles.header,
    alignment === 'Center' ? styles.headerCenter : styles.headerLeft,
  ].filter(Boolean).join(' ')

  const headlineClasses = [
    styles.headline,
    darkMode && styles.headlineDark,
  ].filter(Boolean).join(' ')

  const subtextClasses = [
    styles.subtext,
    darkMode && styles.subtextDark,
  ].filter(Boolean).join(' ')

  return (
    <div className={headerWrapperClasses}>
      <div className={headerClasses}>
        <HeadingTag className={headlineClasses}>
          {headline}
        </HeadingTag>
        {showSubtext && subtext && (
          <p className={subtextClasses}>{subtext}</p>
        )}
      </div>
    </div>
  )
}
