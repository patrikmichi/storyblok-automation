---
description: "CSS Modules and design system standards using design tokens"
globs: ["**/*.module.css", "**/*.tsx"]
alwaysApply: false
---

# CSS Modules & Design System Standards

## Design Tokens

All design tokens are defined in `storyblok-app/styles/tokens.css`:

- Colors: Use CSS variables (e.g., `var(--color-primary)`)
- Typography: Use CSS variables for font families, sizes, weights
- Spacing: Use CSS variables for consistent spacing
- Breakpoints: Use CSS variables for responsive design

## CSS Module Structure

```css
/* Component.module.css */
.component {
  /* Use design tokens */
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  padding: var(--spacing-lg);
  
  /* Component-specific styles */
  display: flex;
  flex-direction: column;
}
```

## Dynamic Styles

For dynamic values (padding, colors from Storyblok), use inline styles:

```tsx
<div 
  className={styles.section}
  style={{
    paddingTop: `${padding_top}px`,
    paddingBottom: `${padding_bottom}px`,
  }}
>
```

## Figma Design Matching

- Match exact dimensions from Figma
- Use exact spacing values (no approximations)
- Match colors exactly (use hex values from Figma)
- Match typography (font family, size, weight, line height)
- Match border radius, shadows, etc.

## No Tailwind CSS

This project uses CSS Modules exclusively. Do not use Tailwind classes.

## File Naming

- Component: `ComponentName.tsx`
- Styles: `ComponentName.module.css`
- Import: `import styles from './ComponentName.module.css'`

