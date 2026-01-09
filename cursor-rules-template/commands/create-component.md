# Create New Storyblok Component

Create a complete Storyblok component from Figma design.

## Workflow

1. **Get Figma Design**
   - Provide Figma URL with node ID
   - Extract component structure and design specs

2. **Generate Schema**
   - Run schema generation
   - Include all required fields (headline, padding, heading_level, etc.)
   - Add component-specific fields

3. **Create Presentational Component**
   - Location: `storyblok-app/src/components/presentational/ComponentName.tsx`
   - Use CSS Modules: `ComponentName.module.css`
   - Match Figma design exactly
   - Use design tokens from `styles/tokens.css`

4. **Create Storyblok Wrapper**
   - Location: `storyblok-app/src/storyblok/components/component_name.tsx`
   - Mark as `'use client'`
   - Map Storyblok `blok` to component props
   - Handle data normalization

5. **Register Component**
   - Add to `storyblok-app/src/storyblok/generated.components.ts`
   - Export wrapper component
   - Component name must match schema `name`

6. **Push Schema**
   ```bash
   cd schema-generator
   npm run push:schema:n8n <component_name>
   ```
   - Uses n8n webhook workflow for secure credential management
   - Automatically creates or updates component in Storyblok
   - Verify component appears in Storyblok dashboard

7. **Test**
   - Test in Storyblok preview mode
   - Verify all fields work correctly
   - Check responsive behavior

## Component Structure Template

```typescript
// Presentational Component
export interface ComponentNameProps {
  // Props matching Storyblok schema
}

export function ComponentName({ ... }: ComponentNameProps) {
  return (
    <div className={styles.component}>
      {/* Component JSX */}
    </div>
  )
}
```

```typescript
// Storyblok Wrapper
'use client'
import { ComponentName } from '@/src/components/presentational/ComponentName'

interface ComponentNameBlok {
  _uid: string
  component: 'component_name'
  // Schema fields
}

export default function ComponentNameBlok({ blok }: { blok: ComponentNameBlok }) {
  return <ComponentName {...mappedProps} />
}
```

