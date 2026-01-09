# Architecture Guide

Design decisions and patterns used in the Storyblok automation workflow.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Workflow Orchestration](#workflow-orchestration)
- [Schema Structure](#schema-structure)
- [File Organization](#file-organization)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)

## Component Architecture

### Two-File Component Pattern

We use a **separation of concerns** pattern with two files per component:

#### 1. Presentational Component
**Location**: `storyblok-app/src/components/presentational/<ComponentName>.tsx`

**Purpose**: Pure React component focused on UI/display logic

**Characteristics**:
- ✅ No Storyblok dependencies
- ✅ Reusable in other contexts (tests, Storybook, other CMSs)
- ✅ Easy to test with mock data
- ✅ CMS-agnostic
- ✅ Handles styling and layout

**Example**:
```tsx
export function BenefitsSection({
  headline,
  subtext,
  benefits,
  ...
}: BenefitsSectionProps) {
  // Pure UI logic, no Storyblok knowledge
  return <div>...</div>
}
```

#### 2. Storyblok Wrapper Component
**Location**: `storyblok-app/src/storyblok/components/<component_name>.tsx`

**Purpose**: Adapter that connects Storyblok data to presentational component

**Characteristics**:
- ✅ Handles Storyblok-specific data structures
- ✅ Maps `blok` props to presentational props
- ✅ Data normalization and transformation
- ✅ Marked as `'use client'` for Next.js
- ✅ Storyblok-specific logic

**Example**:
```tsx
export default function BenefitsSectionBlok({ blok }: { blok: BenefitsSectionBlok }) {
  return (
    <BenefitsSection
      headline={blok.headline}
      subtext={blok.subtext}
      // Maps Storyblok structure to presentational props
    />
  )
}
```

### Why This Separation?

#### Benefits:

1. **Reusability**: Presentational components can be used outside Storyblok
   - Storybook for component documentation
   - Unit tests with mock data
   - Other CMS integrations
   - Standalone demos

2. **Testability**: Easy to test presentational components
   ```tsx
   // Easy to test with mock data
   test('BenefitsSection renders correctly', () => {
     render(<BenefitsSection headline="Test" benefits={[]} />)
   })
   ```

3. **Maintainability**: UI logic separate from data fetching
   - Change CMS without changing UI
   - Update data mapping without touching UI
   - Clear separation of responsibilities

4. **Flexibility**: Can swap CMS without changing presentational components
   - Storyblok → Contentful: Only change wrappers
   - Storyblok → Strapi: Only change wrappers
   - Presentational components remain unchanged

5. **Storyblok Integration**: Wrappers handle Storyblok-specific concerns
   - `blok` data structure
   - Field mapping
   - Nested component resolution
   - Draft/preview mode handling

#### Data Flow:

```
Storyblok CMS
    ↓
Storyblok API (returns blok data)
    ↓
Storyblok Wrapper (benefits_section.tsx)
    ↓ (transforms blok → props)
Presentational Component (BenefitsSection.tsx)
    ↓ (renders UI)
Browser
```

## Workflow Orchestration

### Orchestrated Workflow Design

The workflow follows a **pipeline pattern** with automatic orchestration:

```
Schema Generation
    ↓
Validation
    ↓
Component Generation
    ↓
Push to Storyblok
    ↓
Code Review
```

### Why Orchestration?

1. **Consistency**: Ensures all steps run in correct order
2. **Automation**: Reduces manual steps and errors
3. **Validation**: Catches issues early (before push)
4. **Quality**: Code review ensures no linting/type errors

### Skip Behavior

Components and schemas are **never overwritten** by default:

- **Schemas**: Skip if file exists (prevents accidental overwrites)
- **Components**: Skip if files exist (preserves manual implementations)
- **Registration**: Always updates (ensures components are registered)

**Rationale**: 
- Protects manual customizations
- Prevents accidental data loss
- Allows incremental development

## Schema Structure

### Schema Organization

Schemas are organized by type:

```
schemas/storyblok/
├── bloks/          # Main section components
│   ├── benefits_section.json
│   ├── business_types_section.json
│   └── ...
└── nested/          # Reusable nested components
    ├── benefit_item.json
    ├── primary_button.json
    └── ...
```

### Why This Organization?

1. **Clear Separation**: Main sections vs reusable components
2. **Storyblok Alignment**: Matches Storyblok's component categories
3. **Validation**: Easier to validate nested component dependencies
4. **Maintenance**: Clear structure for finding components

### Schema Field Structure

Each field follows a consistent structure:

```json
{
  "field_name": {
    "type": "text|textarea|number|boolean|option|bloks|asset|multilink",
    "required": true|false,
    "pos": 0,  // Sequential position
    "default_value": "...",  // Optional
    "options": [...],  // For option fields
    "description": "Field description"
  }
}
```

**Design Decisions**:
- `pos` ensures consistent field ordering
- `required` defaults to `true` for safety
- `description` provides context for content editors
- `default_value` helps with content creation

## File Organization

### Project Structure

```
storyblok-automation/
├── schema-generator/          # Schema generation tool
│   ├── scripts/               # Generation scripts
│   │   ├── generate-schema.ts
│   │   ├── generate-component.ts
│   │   ├── orchestrate.ts
│   │   └── shared/            # Shared utilities
│   │       ├── validation.ts
│   │       ├── push.ts
│   │       └── code-review.ts
│   └── schemas/               # Generated schemas
│       └── storyblok/
│           ├── bloks/
│           └── nested/
├── storyblok-app/             # Next.js application
│   ├── src/
│   │   ├── components/
│   │   │   └── presentational/  # Pure React components
│   │   └── storyblok/
│   │       └── components/       # Storyblok wrappers
│   └── app/                    # Next.js pages
└── docs/                      # Documentation
    ├── SCRIPTS_REFERENCE.md
    ├── TROUBLESHOOTING.md
    └── ARCHITECTURE.md
```

### Why This Structure?

1. **Separation of Concerns**: 
   - Schema generation separate from app
   - Presentational components separate from wrappers
   - Shared utilities in dedicated folder

2. **Scalability**:
   - Easy to add new scripts
   - Clear where to find components
   - Documentation centralized

3. **Maintainability**:
   - Related files grouped together
   - Clear naming conventions
   - Easy to navigate

## Design Patterns

### 1. Pipeline Pattern

Workflow steps execute in sequence:

```typescript
validate() → generateComponent() → push() → review()
```

**Benefits**:
- Clear execution order
- Easy to add new steps
- Fail-fast (stops on error)

### 2. Adapter Pattern

Storyblok wrappers adapt `blok` data to component props:

```typescript
// Adapter transforms Storyblok structure
blok.headline → props.headline
blok.benefits → props.benefits (with transformation)
```

**Benefits**:
- Decouples Storyblok from UI
- Easy to change data source
- Consistent prop interface

### 3. Factory Pattern

Schema mapper generates schemas based on component type:

```typescript
mapper.generateBenefitsSectionSchema()
mapper.generateBenefitItemSchema()
```

**Benefits**:
- Consistent schema generation
- Easy to add new component types
- Centralized mapping logic

### 4. Strategy Pattern

Multiple push methods (n8n vs direct API):

```typescript
pushSchemaToStoryblok(name, schemasRoot, { method: 'n8n' | 'direct' })
```

**Benefits**:
- Flexible deployment options
- Easy to add new methods
- Consistent interface

## Data Flow

### Complete Workflow Data Flow

```
1. Figma Design
   ↓ (Figma MCP)
2. Design Context (stored in figma-context/)
   ↓ (generate-schema.ts)
3. Storyblok Schema (JSON)
   ↓ (validate-schema.ts)
4. Validated Schema
   ↓ (generate-component.ts)
5. React Components
   ├── Presentational Component
   ├── CSS Module
   └── Storyblok Wrapper
   ↓ (update generated.components.ts)
6. Registered Component
   ↓ (push-schema.ts)
7. Storyblok CMS (via API)
   ↓ (Storyblok API)
8. Content Data (blok)
   ↓ (Storyblok Wrapper)
9. Component Props
   ↓ (Presentational Component)
10. Rendered UI
```

### Component Registration Flow

```
Component Generation
    ↓
Check if exists (skip if exists)
    ↓
Generate files
    ↓
Update generated.components.ts
    ├── Add import
    └── Add to storyblokComponents map
    ↓
Next.js auto-reloads
    ↓
Component available in app
```

## Key Design Decisions

### 1. Why TypeScript?

- **Type Safety**: Catches errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Documentation**: Types serve as documentation
- **Maintainability**: Easier to understand code

### 2. Why CSS Modules?

- **Scoped Styles**: No style conflicts
- **Component Co-location**: Styles next to components
- **Type Safety**: TypeScript support for CSS
- **Performance**: Only loads needed styles

### 3. Why n8n for Push?

- **Security**: Credentials not in code
- **Flexibility**: Easy to modify workflow
- **Monitoring**: n8n execution logs
- **Reusability**: Same workflow for multiple projects

### 4. Why Auto-Skip Behavior?

- **Safety**: Prevents accidental overwrites
- **Incremental Development**: Build on existing work
- **Manual Customization**: Preserve manual changes
- **Idempotency**: Safe to run multiple times

### 5. Why Orchestration?

- **Consistency**: Same steps every time
- **Automation**: Reduces manual work
- **Quality**: Ensures validation and review
- **Speed**: Faster than manual steps

## Extension Points

### Adding New Component Types

1. Add schema generation method to `schema-mapper.ts`:
   ```typescript
   generateNewComponentSchema(): StoryblokSchema {
     // Schema definition
   }
   ```

2. Add to `generate-schema.ts` component detection:
   ```typescript
   if (blockName === 'new_component') {
     const schema = mapper.generateNewComponentSchema();
     await writeSchema(schema, 'new_component', 'bloks');
   }
   ```

### Adding New Validation Rules

1. Add to `shared/validation.ts`:
   ```typescript
   function validateCustomRule(schema: StoryblokSchema): ValidationError[] {
     // Custom validation logic
   }
   ```

2. Integrate into validation pipeline

### Adding New Push Methods

1. Add to `shared/push.ts`:
   ```typescript
   async function pushViaNewMethod(...) {
     // New push implementation
   }
   ```

2. Add to push method selection logic

## Best Practices

### Component Development

1. **Start with Schema**: Define data structure first
2. **Generate Components**: Use automation to create files
3. **Customize UI**: Implement presentational component
4. **Test**: Verify in Storyblok preview
5. **Review**: Run code review before committing

### Schema Design

1. **Use Descriptive Names**: `benefits_section` not `bs`
2. **Add Descriptions**: Help content editors understand fields
3. **Set Defaults**: Make content creation easier
4. **Validate Early**: Run validation before push
5. **Document Variants**: Use options for component variants

### Code Organization

1. **Follow Naming Conventions**: 
   - Schemas: `snake_case`
   - Components: `PascalCase`
   - Files: Match component names

2. **Keep Components Focused**: One responsibility per component
3. **Reuse Nested Components**: Don't duplicate logic
4. **Document Complex Logic**: Add comments for non-obvious code

## Future Considerations

### Potential Improvements

1. **Component Library**: Extract presentational components to separate package
2. **Schema Versioning**: Track schema changes over time
3. **Automated Testing**: Add component snapshot tests
4. **Design Token System**: Centralize design tokens
5. **Component Documentation**: Auto-generate Storybook stories

### Scalability

The architecture supports:
- **Multiple Projects**: Reuse schema generator
- **Multiple CMSs**: Swap wrappers, keep presentational components
- **Team Collaboration**: Clear separation of concerns
- **CI/CD Integration**: Scripts can be run in automation

