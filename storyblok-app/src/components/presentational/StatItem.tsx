import React from 'react'
import styles from './StatItem.module.css'

export interface StatItemProps {
  number: string  // Stat number or value
  description: string  // Stat description text
  className?: string
}

/**
 * Stat Item Component
 * @param number - Stat number or value
 * @param description - Stat description text
 */
export function StatItem({
  number,
  description,
  className = '',
}: StatItemProps) {
  const itemClasses = [
    styles.statItem,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={itemClasses}>
      <div className={styles.number}>{number}</div>
      <div className={styles.description}>{description}</div>
    </div>
  )
}
