import React from 'react'
import styles from './SecurityCard.module.css'

export interface SecurityCardProps {
  image?: string  // Security certification image
  headline: string  // Card headline
  subtext?: string  // Card description/subtext
  show_subtext?: boolean  // Show/hide subtext
  link?: {
    url?: string
    cached_url?: string
    id?: string
    email?: string
    linktype?: string
  }  // Optional link for the card
  link_label?: string  // Link label text (shown if link is provided)
  show_link?: boolean  // Show/hide link
  card_type?: 'Shadow' | 'Border' | 'Dark'  // Card visual style type
  className?: string
}

/**
 * Security Card Component
 * @param image - Security certification image
 * @param headline - Card headline
 * @param subtext - Card description/subtext
 * @param show_subtext - Show/hide subtext
 * @param link - Optional link for the card
 * @param link_label - Link label text (shown if link is provided)
 * @param show_link - Show/hide link
 * @param card_type - Card visual style type
 */
export function SecurityCard({
  image,
  headline,
  subtext,
  show_subtext = true,
  link,
  link_label,
  show_link = true,
  card_type = 'Border',
  className = '',
}: SecurityCardProps) {
  const cardClasses = [
    styles.card,
    card_type === 'Shadow' && styles.cardShadow,
    card_type === 'Border' && styles.cardBorder,
    card_type === 'Dark' && styles.cardDark,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses}>
      <div className={styles.content}>
        {/* Image */}
        {image && (
          <div className={styles.image}>
            <img src={image} alt="" className={styles.imageElement} />
          </div>
        )}

        {/* Text Content */}
        <div className={styles.textContent}>
          <div className={styles.textGroup}>
            <p className={styles.headline}>{headline}</p>
            {show_subtext && subtext && (
              <p className={styles.subtext}>{subtext}</p>
            )}
          </div>

          {/* Link */}
          {show_link && link && link.url && link_label && (
            <div className={styles.link}>
              <span className={styles.linkLabel}>{link_label}</span>
              <div className={styles.linkIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
