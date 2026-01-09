import styles from './BenefitItem.module.css'

export interface BenefitItemProps {
  icon?: string  // Icon image for the benefit
  headline: string  // Benefit headline
  description?: string  // Benefit description
  link?: {
    url?: string
    cached_url?: string
    id?: string
    email?: string
    linktype?: string
  }  // Optional link for the benefit
  link_label?: string  // Link label text (shown if link is provided)
  light_dark?: 'false' | 'true'  // Use dark/light variant (for dark backgrounds)
  className?: string
}

/**
 * Benefit Item Component
 * @param icon - Icon image for the benefit
 * @param headline - Benefit headline
 * @param description - Benefit description
 * @param link - Optional link for the benefit
 * @param link_label - Link label text (shown if link is provided)
 * @param light_dark - Use dark/light variant (for dark backgrounds)
 */
export function BenefitItem({
  icon,
  headline,
  description,
  link,
  link_label,
  light_dark = 'false',
  className = '',
}: BenefitItemProps) {
  const isDark = light_dark === 'true'
  
  const itemClasses = [
    styles.item,
    isDark && styles.itemDark,
    className,
  ].filter(Boolean).join(' ')

  const contentClasses = [
    styles.content,
    isDark && styles.contentDark,
  ].filter(Boolean).join(' ')

  const headlineClasses = [
    styles.headline,
    isDark && styles.headlineDark,
  ].filter(Boolean).join(' ')

  const descriptionClasses = [
    styles.description,
    isDark && styles.descriptionDark,
  ].filter(Boolean).join(' ')

  return (
    <div className={itemClasses}>
      {/* Icon */}
      {icon && (
        <div className={styles.icon}>
          <img src={icon} alt="" className={styles.iconImage} />
        </div>
      )}

      {/* Content */}
      <div className={contentClasses}>
        <div className={styles.textGroup}>
          <p className={headlineClasses}>{headline}</p>
          {description && (
            <p className={descriptionClasses}>{description}</p>
          )}
        </div>

        {/* Link */}
        {link && link.url && link_label && (
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
  )
}
