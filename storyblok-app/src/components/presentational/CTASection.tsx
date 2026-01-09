import styles from './CTASection.module.css'
import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import type { PrimaryButtonProps } from './PrimaryButton'
import type { SecondaryButtonProps } from './SecondaryButton'

export interface CTASectionProps {
  headline: string
  subtext?: string
  showSubtext?: boolean
  primaryButton?: PrimaryButtonProps
  secondaryButton?: SecondaryButtonProps
  container?: 'Container' | 'FW'
  graphics?: 'Opacity' | 'Colors'
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  padding_top?: number
  padding_bottom?: number
  className?: string
}

export function CTASection({
  headline,
  subtext,
  showSubtext = true,
  primaryButton,
  secondaryButton,
  container = 'Container',
  graphics = 'Colors',
  headingLevel = 'h2',
  padding_top,
  padding_bottom,
  className = '',
}: CTASectionProps) {
  const isFullWidth = container === 'FW'
  const isOpacity = graphics === 'Opacity'
  
  // Default padding values based on container type
  const defaultPaddingTop = isFullWidth ? 96 : 96
  const defaultPaddingBottom = isFullWidth ? 96 : 24
  const finalPaddingTop = padding_top ?? defaultPaddingTop
  const finalPaddingBottom = padding_bottom ?? defaultPaddingBottom
  
  // Dynamic heading component
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements

  // Determine which graphics image to use based on container and graphics type (from Figma)
  const getGraphicsImage = () => {
    if (isFullWidth && isOpacity) {
      return 'http://localhost:3845/assets/186c5a3f63c66b032bf69079dd78500401c7cb5b.svg'
    }
    if (isFullWidth && !isOpacity) {
      return 'http://localhost:3845/assets/0eb10c2ecb32f0abcaed3ce3f7971637046a1f3c.svg'
    }
    if (!isFullWidth && isOpacity) {
      return 'http://localhost:3845/assets/f8b6475ec2790dddf99b08eff388c2e8529badcf.svg'
    }
    // Container + Colors (default)
    return 'http://localhost:3845/assets/4f6bdec38c5a04fd9abf8962fb526bfc21789b67.svg'
  }

  const sectionClasses = [
    styles.section,
    isFullWidth ? styles.sectionFullWidth : styles.sectionContainer,
    isFullWidth && isOpacity && styles.graphicsOpacityFW,
    isFullWidth && !isOpacity && styles.graphicsColorsFW,
    !isFullWidth && isOpacity && styles.graphicsOpacity,
    !isFullWidth && !isOpacity && styles.graphicsColors,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={sectionClasses}
      style={!isFullWidth ? {
        paddingTop: `${finalPaddingTop}px`,
        paddingBottom: `${finalPaddingBottom}px`,
      } : {
        paddingTop: `${finalPaddingTop}px`,
        paddingBottom: `${finalPaddingBottom}px`,
      }}
    >
      {!isFullWidth && (
        <div className={styles.backgroundGreyWrapper}>
          <div className={styles.backgroundGrey} />
        </div>
      )}
      
      <div className={styles.content}>
        {/* Graphics - Static SVG images from Figma */}
        <div className={styles.graphics}>
          <img
            src={getGraphicsImage()}
            alt=""
            className={styles.graphicsImage}
          />
        </div>

        <div className={styles.contentInner}>
          <div className={styles.textGroup}>
            <HeadingTag className={styles.headline}>
              {headline}
            </HeadingTag>
            {showSubtext && subtext && (
              <p className={styles.subtext}>
                {subtext}
              </p>
            )}
          </div>

          <div className={styles.buttons}>
            {primaryButton && (
              <PrimaryButton
                {...primaryButton}
                variant={primaryButton.variant || 'On Dark'}
              />
            )}
            {secondaryButton && (
              <SecondaryButton
                {...secondaryButton}
                variant={secondaryButton.variant || 'On Dark'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

