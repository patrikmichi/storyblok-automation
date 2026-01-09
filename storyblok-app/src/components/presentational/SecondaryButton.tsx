import styles from './SecondaryButton.module.css'

export interface SecondaryButtonProps {
  label: string
  link?: {
    url?: string
    cached_url?: string
    id?: string
    email?: string
    linktype?: string
  }
  variant?: 'On Dark' | 'On Light'
  className?: string
}

export function SecondaryButton({
  label,
  link,
  variant = 'On Dark',
  className = '',
}: SecondaryButtonProps) {
  const isOnDark = variant === 'On Dark'

  const buttonClasses = [
    styles.button,
    isOnDark ? styles.buttonOnDark : styles.buttonOnLight,
    className,
  ].filter(Boolean).join(' ')

  // Handle multilink: can be url, story (cached_url), or email
  const getHref = () => {
    if (!link) return null
    if (link.url) return link.url
    if (link.cached_url) return link.cached_url
    if (link.email) return `mailto:${link.email}`
    return null
  }

  const href = getHref()

  if (!href) {
    return (
      <div className={buttonClasses}>
        {label}
      </div>
    )
  }

  return (
    <a
      href={href}
      className={buttonClasses}
    >
      {label}
    </a>
  )
}

