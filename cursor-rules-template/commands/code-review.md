# Code Review Checklist

Review code changes for Storyblok components and Next.js app.

## Component Review

- [ ] **Schema**
  - [ ] All fields have correct types
  - [ ] Field positions are sequential
  - [ ] Default values are appropriate
  - [ ] Required fields are marked correctly

- [ ] **Presentational Component**
  - [ ] TypeScript interface matches schema
  - [ ] CSS Module used (no inline styles except dynamic)
  - [ ] Design matches Figma exactly
  - [ ] Uses design tokens from `tokens.css`
  - [ ] Responsive behavior tested

- [ ] **Storyblok Wrapper**
  - [ ] Marked as `'use client'`
  - [ ] Maps all schema fields correctly
  - [ ] Handles data normalization
  - [ ] Handles optional fields gracefully

- [ ] **Registration**
  - [ ] Component registered in `generated.components.ts`
  - [ ] Component name matches schema

## Next.js App Review

- [ ] **Server Components**
  - [ ] Uses `getStoryblokApi()` correctly
  - [ ] Handles draft mode properly
  - [ ] Cache busting in preview mode

- [ ] **Metadata**
  - [ ] `generateMetadata` implemented
  - [ ] Fallbacks for missing content

- [ ] **Performance**
  - [ ] No unnecessary client components
  - [ ] Proper code splitting
  - [ ] Images optimized

## Testing

- [ ] Component renders in Storyblok preview
- [ ] All fields editable in Storyblok
- [ ] Dynamic values work (padding, heading level)
- [ ] Responsive design works
- [ ] No console errors
- [ ] No TypeScript errors

