import Image from 'next/image'
import styles from './BusinessTypeCard.module.css'

export interface BusinessTypeCardProps {
  headline: string
  description?: string
  tags?: string
  image?: {
    filename?: string
    alt?: string
  }
  className?: string
}

export function BusinessTypeCard({
  headline,
  description,
  tags,
  image,
  className = '',
}: BusinessTypeCardProps) {
  // Parse tags (comma-separated or newline-separated)
  const tagList = tags
    ? tags
        .split(/[,\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    : []

  return (
    <div className={`${styles.card} ${className || ''}`}>
      <div className={styles.content}>
        {/* Content */}
        <div className={styles.textGroup}>
          <h3 className={styles.headline}>
            {headline}
          </h3>
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}
        </div>

        {/* Tags/Chips */}
        {tagList.length > 0 && (
          <div className={styles.tags}>
            {tagList.map((tag, index) => (
              <div key={index} className={styles.tag}>
                <span className={styles.tagText}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image - Exact Figma: h-[256px] w-[592px] */}
      {image?.filename ? (
        <div className={styles.image}>
          <Image
            src={image.filename}
            alt={image.alt || headline}
            fill
            className={styles.imageContent}
          />
        </div>
      ) : (
        <div className={styles.imagePlaceholder} />
      )}
    </div>
  )
}
